import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterAPI } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  try {
    const { message, userContext, messageHistory } = await request.json();

    // Validate required fields
    if (!message || !userContext) {
      return NextResponse.json(
        { error: 'Message and user context are required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured' },
        { status: 500 }
      );
    }

    // Generate AI response
    const openRouter = new OpenRouterAPI();
    const aiResponse = await openRouter.generateChatResponse(
      message,
      userContext,
      messageHistory || []
    );

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
