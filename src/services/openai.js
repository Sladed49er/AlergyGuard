import axios from 'axios';

// Get API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Check if API key is configured
if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file');
}

/**
 * Analyzes ingredients for potential allergens based on user's allergy profile
 * @param {string} ingredients - The ingredients to analyze
 * @param {Array} allergyProfile - Array of allergy objects with type and severity
 * @returns {Object} Analysis results with safety rating and warnings
 */
export const checkIngredientsForAllergens = async (ingredients, allergyProfile) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert allergist and food safety specialist. Analyze ingredients for potential allergens based on the user's allergy profile. 
            
            Provide your response in the following JSON format:
            {
              "safetyRating": "safe" | "caution" | "danger",
              "warnings": [
                {
                  "allergen": "allergen name",
                  "severity": "mild" | "moderate" | "severe",
                  "ingredient": "specific ingredient causing concern",
                  "reason": "explanation"
                }
              ],
              "crossContaminationRisk": "low" | "medium" | "high",
              "summary": "brief summary of findings"
            }`
          },
          {
            role: "user",
            content: `Check these ingredients: ${ingredients}
            
            User's allergy profile: ${JSON.stringify(allergyProfile)}
            
            Please check for:
            1. Direct allergen presence
            2. Hidden allergens (e.g., casein = dairy)
            3. Cross-contamination risks
            4. Alternative names for allergens`
          }
        ],
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    throw new Error('Failed to analyze ingredients. Please try again.');
  }
};

/**
 * Generates an allergy-safe meal plan based on user preferences
 * @param {Array} allergyProfile - Array of allergy objects
 * @param {Object} preferences - User preferences for meal planning
 * @returns {Array} Array of meal suggestions
 */
export const generateAllergySafeMealPlan = async (allergyProfile, preferences = {}) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const { 
    dietaryRestrictions = [], 
    cuisinePreferences = [], 
    numberOfMeals = 7,
    mealTypes = ['breakfast', 'lunch', 'dinner'],
    budget = 'medium'
  } = preferences;
  
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a professional nutritionist and chef specializing in allergy-safe meal planning. 
            Create diverse, nutritious, and delicious meal plans that strictly avoid all mentioned allergens.
            
            Provide your response in the following JSON format:
            {
              "meals": [
                {
                  "day": "Day 1",
                  "mealType": "breakfast" | "lunch" | "dinner",
                  "name": "Meal name",
                  "ingredients": ["ingredient 1", "ingredient 2"],
                  "instructions": ["step 1", "step 2"],
                  "prepTime": "15 minutes",
                  "cookTime": "20 minutes",
                  "nutrition": {
                    "calories": 350,
                    "protein": "15g",
                    "carbs": "45g",
                    "fat": "12g"
                  },
                  "allergensFree": ["peanut", "dairy", "gluten"],
                  "tips": "Serving suggestions or variations"
                }
              ],
              "shoppingList": {
                "produce": ["item 1", "item 2"],
                "proteins": ["item 1", "item 2"],
                "grains": ["item 1", "item 2"],
                "other": ["item 1", "item 2"]
              },
              "mealPrepTips": ["tip 1", "tip 2"]
            }`
          },
          {
            role: "user",
            content: `Create a ${numberOfMeals}-meal plan with these requirements:
            
            Allergies to avoid: ${JSON.stringify(allergyProfile)}
            Dietary restrictions: ${dietaryRestrictions.join(', ') || 'None'}
            Cuisine preferences: ${cuisinePreferences.join(', ') || 'Any'}
            Meal types needed: ${mealTypes.join(', ')}
            Budget level: ${budget}
            
            Requirements:
            1. Ensure 100% safety from listed allergens
            2. Include variety in meals
            3. Balance nutrition across all meals
            4. Use common, accessible ingredients
            5. Keep prep time reasonable for families`
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Meal planning error:', error.response?.data || error.message);
    throw new Error('Failed to generate meal plan. Please try again.');
  }
};

/**
 * Analyzes a restaurant menu item for allergens
 * @param {string} menuItem - The menu item description
 * @param {Array} allergyProfile - User's allergy profile
 * @returns {Object} Safety analysis of the menu item
 */
export const analyzeRestaurantMenuItem = async (menuItem, allergyProfile) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a food allergy expert analyzing restaurant menu items for safety.
            
            Provide your response in the following JSON format:
            {
              "safetyRating": "safe" | "caution" | "danger" | "unknown",
              "potentialAllergens": ["allergen1", "allergen2"],
              "hiddenRisks": ["risk1", "risk2"],
              "questionsToAsk": ["question1", "question2"],
              "modifications": ["modification1", "modification2"],
              "confidence": "high" | "medium" | "low",
              "explanation": "detailed explanation"
            }`
          },
          {
            role: "user",
            content: `Analyze this menu item: "${menuItem}"
            
            User's allergies: ${JSON.stringify(allergyProfile)}
            
            Consider:
            1. Common ingredients in this type of dish
            2. Hidden allergens (sauces, marinades, cooking methods)
            3. Cross-contamination risks
            4. Questions the user should ask the restaurant
            5. Possible modifications to make it safe`
          }
        ],
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Menu analysis error:', error.response?.data || error.message);
    throw new Error('Failed to analyze menu item. Please try again.');
  }
};

/**
 * Generates emergency action plan for allergic reactions
 * @param {Array} allergyProfile - User's allergy profile with severity levels
 * @returns {Object} Emergency action plan
 */
export const generateEmergencyPlan = async (allergyProfile) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a medical professional creating personalized emergency action plans for allergic reactions.
            
            Provide your response in the following JSON format:
            {
              "emergencySteps": [
                {
                  "severity": "mild" | "moderate" | "severe",
                  "symptoms": ["symptom1", "symptom2"],
                  "actions": ["action1", "action2"],
                  "medications": ["medication1", "medication2"],
                  "whenToCallEmergency": "specific conditions"
                }
              ],
              "medicationsToCarry": ["medication1", "medication2"],
              "emergencyContacts": [
                {
                  "type": "Primary Doctor" | "Emergency Services" | "Poison Control",
                  "notes": "when to contact"
                }
              ],
              "preventionTips": ["tip1", "tip2"],
              "importantNotes": "critical information"
            }`
          },
          {
            role: "user",
            content: `Create an emergency action plan for these allergies: ${JSON.stringify(allergyProfile)}
            
            Include:
            1. Step-by-step actions for different severity reactions
            2. Medications and dosages (general guidance)
            3. When to call emergency services
            4. What to tell emergency responders
            5. Prevention strategies`
          }
        ],
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Emergency plan error:', error.response?.data || error.message);
    throw new Error('Failed to generate emergency plan. Please try again.');
  }
};

/**
 * Quick check for a single ingredient
 * @param {string} ingredient - The ingredient to check
 * @param {Array} allergyProfile - User's allergy profile
 * @returns {Object} Quick safety assessment
 */
export const quickIngredientCheck = async (ingredient, allergyProfile) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo", // Use faster model for quick checks
        messages: [
          {
            role: "system",
            content: "You are an allergen detection expert. Provide quick, accurate assessments of ingredient safety."
          },
          {
            role: "user",
            content: `Is "${ingredient}" safe for someone with these allergies: ${allergyProfile.map(a => a.type).join(', ')}? 
            
            Reply with only: SAFE, UNSAFE, or UNCERTAIN followed by a brief reason (max 20 words).`
          }
        ],
        temperature: 0.1,
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const result = response.data.choices[0].message.content;
    const [status, ...reasonParts] = result.split(' ');
    
    return {
      safe: status === 'SAFE',
      status: status,
      reason: reasonParts.join(' ')
    };
  } catch (error) {
    console.error('Quick check error:', error.response?.data || error.message);
    throw new Error('Failed to check ingredient. Please try again.');
  }
};