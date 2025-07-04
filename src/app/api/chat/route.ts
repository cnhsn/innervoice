import { NextRequest, NextResponse } from 'next/server';
import { 
  OpenRouterAPI, 
  APIRateLimitError, 
  APIQuotaExceededError, 
  APIAuthenticationError, 
  APIServiceUnavailableError 
} from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  try {
    const { message, userContext, messageHistory, language } = await request.json();

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
      messageHistory || [],
      language || 'en'
    );

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Handle specific API errors with appropriate status codes and messages
    if (error instanceof APIRateLimitError) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          message: error.message,
          retryAfter: error.retryAfter 
        },
        { 
          status: 429,
          headers: error.retryAfter ? { 'Retry-After': error.retryAfter.toString() } : {}
        }
      );
    }
    
    if (error instanceof APIQuotaExceededError) {
      return NextResponse.json(
        { 
          error: 'Quota exceeded', 
          message: error.message 
        },
        { status: 402 }
      );
    }
    
    if (error instanceof APIAuthenticationError) {
      return NextResponse.json(
        { 
          error: 'Authentication failed', 
          message: 'Please check your API configuration.' 
        },
        { status: 401 }
      );
    }
    
    if (error instanceof APIServiceUnavailableError) {
      return NextResponse.json(
        { 
          error: 'Service unavailable', 
          message: error.message 
        },
        { status: 503 }
      );
    }
    
    // Generic error for unexpected issues
    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
