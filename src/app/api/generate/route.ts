import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterAPI } from '@/lib/openrouter';
import { userFormSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validationResult = userFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const userData = validationResult.data;

    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured' },
        { status: 500 }
      );
    }

    // Generate AI response
    const openRouter = new OpenRouterAPI();
    const aiResponse = await openRouter.generateResponse(userData);

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
