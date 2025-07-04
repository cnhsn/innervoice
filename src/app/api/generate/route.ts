import { NextRequest, NextResponse } from 'next/server';
import { 
  OpenRouterAPI, 
  APIRateLimitError, 
  APIQuotaExceededError, 
  APIAuthenticationError, 
  APIServiceUnavailableError 
} from '@/lib/openrouter';
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
    const language = body.language || 'en'; // Default to English

    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured' },
        { status: 500 }
      );
    }

    // Generate AI response
    const openRouter = new OpenRouterAPI();
    const aiResponse = await openRouter.generateResponse(userData, language);

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('Error in generate API:', error);
    
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
