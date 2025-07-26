// app/api/analyze-ingredients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const COMMON_ALLERGENS = [
  'milk', 'eggs', 'fish', 'shellfish', 'tree nuts', 'peanuts', 'wheat', 'soybeans',
  'sesame', 'mustard', 'celery', 'lupin', 'mollusks', 'sulfites', 'corn'
]

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ingredients, familyAllergies = [] } = await request.json()

    if (!ingredients || typeof ingredients !== 'string') {
      return NextResponse.json({ error: 'Ingredients text is required' }, { status: 400 })
    }

    // Get user's family allergies if not provided
    let allergies = familyAllergies
    if (allergies.length === 0) {
      const userFamilies = await prisma.family.findMany({
        where: { createdBy: session.user.id },
        include: {
          members: {
            include: {
              allergies: true
            }
          }
        }
      })
      
      allergies = userFamilies.flatMap(family => 
        family.members.flatMap(member => 
          member.allergies.map(allergy => allergy.name.toLowerCase())
        )
      )
    }

    // Analyze with OpenAI
    const analysis = await analyzeIngredientsWithAI(ingredients, allergies)
    
    // Save scan to history
    await prisma.scanHistory.create({
      data: {
        userId: session.user.id,
        ingredients: ingredients,
        analysis: JSON.stringify(analysis),
        detected: analysis.detectedAllergens,
        isProblematic: analysis.detectedAllergens.length > 0
      }
    })

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Ingredient analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze ingredients' },
      { status: 500 }
    )
  }
}

async function analyzeIngredientsWithAI(ingredients: string, familyAllergies: string[]) {
  const prompt = `
You are an expert food allergen detector. Analyze the following ingredient list and detect any potential allergens.

Ingredient List: "${ingredients}"

Family Allergies to Watch For: ${familyAllergies.length > 0 ? familyAllergies.join(', ') : 'None specified'}

Common Allergens to Always Check: ${COMMON_ALLERGENS.join(', ')}

Please provide a JSON response with the following structure:
{
  "detectedAllergens": ["list of allergens found"],
  "riskLevel": "LOW|MEDIUM|HIGH",
  "analysis": "detailed explanation of findings",
  "recommendations": "safety recommendations",
  "ingredientBreakdown": {
    "safe": ["safe ingredients"],
    "concerning": ["potentially problematic ingredients"],
    "dangerous": ["definitely contains allergens"]
  }
}

Be thorough - check for hidden allergens, cross-contamination risks, and alternative names for allergens.
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    return JSON.parse(response)
  } catch (error) {
    console.error('OpenAI analysis error:', error)
    
    // Fallback analysis using simple string matching
    return performFallbackAnalysis(ingredients, familyAllergies)
  }
}

function performFallbackAnalysis(ingredients: string, familyAllergies: string[]) {
  const ingredientsLower = ingredients.toLowerCase()
  const detectedAllergens: string[] = []
  
  // Check family allergies
  familyAllergies.forEach(allergen => {
    if (ingredientsLower.includes(allergen.toLowerCase())) {
      detectedAllergens.push(allergen)
    }
  })
  
  // Check common allergens
  COMMON_ALLERGENS.forEach(allergen => {
    if (ingredientsLower.includes(allergen)) {
      detectedAllergens.push(allergen)
    }
  })

  // Check for common allergen variations
  const allergenPatterns = {
    'milk': ['dairy', 'lactose', 'casein', 'whey', 'butter', 'cream', 'cheese'],
    'eggs': ['egg white', 'egg yolk', 'albumin'],
    'wheat': ['flour', 'gluten', 'semolina', 'durum'],
    'soy': ['soya', 'lecithin'],
    'nuts': ['almond', 'walnut', 'pecan', 'cashew', 'pistachio']
  }

  Object.entries(allergenPatterns).forEach(([allergen, patterns]) => {
    patterns.forEach(pattern => {
      if (ingredientsLower.includes(pattern) && !detectedAllergens.includes(allergen)) {
        detectedAllergens.push(allergen)
      }
    })
  })

  const riskLevel = detectedAllergens.length === 0 ? 'LOW' : 
                   detectedAllergens.length <= 2 ? 'MEDIUM' : 'HIGH'

  return {
    detectedAllergens: [...new Set(detectedAllergens)],
    riskLevel,
    analysis: detectedAllergens.length > 0 
      ? `Found potential allergens: ${detectedAllergens.join(', ')}`
      : 'No obvious allergens detected in ingredient list',
    recommendations: detectedAllergens.length > 0 
      ? 'AVOID this product due to detected allergens. Double-check with manufacturer.'
      : 'Appears safe based on ingredient analysis, but always verify with manufacturer.',
    ingredientBreakdown: {
      safe: ['Analysis performed with basic matching'],
      concerning: detectedAllergens.length > 0 ? [ingredients] : [],
      dangerous: detectedAllergens
    }
  }
}