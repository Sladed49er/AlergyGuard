// app/api/analyze-ingredients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { checkIngredientsForAllergens } from '../../../src/services/openai';

export async function POST(request: NextRequest) {
  try {
    const { ingredients, allergies } = await request.json();

    if (!ingredients || !allergies) {
      return NextResponse.json(
        { error: 'Missing ingredients or allergies' },
        { status: 400 }
      );
    }

    // Call the OpenAI service
    const result = await checkIngredientsForAllergens(ingredients, allergies);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing ingredients:', error);
    
    // Return a safe fallback response
    return NextResponse.json(
      { 
        safetyRating: 'unknown',
        warnings: [],
        crossContaminationRisk: 'unknown',
        summary: 'Unable to analyze ingredients at this time. Please try again.'
      },
      { status: 500 }
    );
  }
}