import { UserFormData, AIResponse, ChatMessage } from '@/types';

// Custom error types for better error handling
export class APIRateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message);
    this.name = 'APIRateLimitError';
  }
}

export class APIQuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIQuotaExceededError';
  }
}

export class APIAuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIAuthenticationError';
  }
}

export class APIServiceUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIServiceUnavailableError';
  }
}

export class OpenRouterAPI {
  private apiKey: string;
  private baseUrl: string;
  private quoteModel: string;
  private letterModel: string;
  private maxRetries: number;
  private baseDelay: number;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    this.quoteModel = process.env.OPENROUTER_MODEL_QUOTE || 'anthropic/claude-3-haiku:beta';
    this.letterModel = process.env.OPENROUTER_MODEL_LETTER || 'anthropic/claude-3-haiku:beta';
    this.maxRetries = 3; // Maximum number of retry attempts
    this.baseDelay = 1000; // Base delay in milliseconds (1 second)
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateRetryDelay(attempt: number, baseDelay: number = this.baseDelay): number {
    // Exponential backoff with jitter: baseDelay * 2^attempt + random(0, 1000)
    return baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
  }

  private async makeRequestWithRetry(prompt: string, model: string): Promise<string> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await this.makeRequest(prompt, model);
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry for certain error types
        if (error instanceof APIAuthenticationError || 
            error instanceof APIQuotaExceededError) {
          throw error;
        }
        
        // Don't retry on the last attempt
        if (attempt === this.maxRetries) {
          break;
        }
        
        // Calculate delay for exponential backoff
        let delay = this.calculateRetryDelay(attempt);
        
        // For rate limit errors, use the retry-after value if available
        if (error instanceof APIRateLimitError && error.retryAfter) {
          delay = error.retryAfter * 1000; // Convert seconds to milliseconds
        }
        
        console.log(`Request failed (attempt ${attempt + 1}/${this.maxRetries + 1}), retrying in ${delay}ms:`, lastError.message);
        await this.sleep(delay);
      }
    }
    
    // If we get here, all retries failed
    throw lastError || new Error('Request failed after all retry attempts');
  }

  private async makeRequest(prompt: string, model: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'InnerVoice',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    // Enhanced error handling for different HTTP status codes
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      switch (response.status) {
        case 401:
          throw new APIAuthenticationError('Invalid API key or authentication failed');
        case 402:
          throw new APIQuotaExceededError('API quota exceeded. Please check your OpenRouter account.');
        case 429:
          const retryAfter = parseInt(response.headers.get('retry-after') || '60');
          throw new APIRateLimitError(
            `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
            retryAfter
          );
        case 500:
        case 502:
        case 503:
        case 504:
          throw new APIServiceUnavailableError('OpenRouter service is temporarily unavailable. Please try again later.');
        default:
          throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}${errorData.error ? ` - ${errorData.error.message || errorData.error}` : ''}`);
      }
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private parseJsonResponse(responseText: string): Record<string, unknown> | null {
    // Remove markdown code blocks if present
    let cleanedResponse = responseText.trim();
    
    // Remove ```json and ``` markers
    cleanedResponse = cleanedResponse.replace(/^```json\s*/i, '');
    cleanedResponse = cleanedResponse.replace(/\s*```$/, '');
    
    // Try to parse the JSON
    try {
      return JSON.parse(cleanedResponse) as Record<string, unknown>;
    } catch (error) {
      console.warn('Failed to parse JSON response:', error);
      console.warn('Raw response:', responseText);
      
      // Try to extract content using regex as fallback
      try {
        // Look for quote and author
        const quoteMatch = cleanedResponse.match(/"quote"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        const authorMatch = cleanedResponse.match(/"author"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        
        if (quoteMatch && authorMatch) {
          return {
            quote: quoteMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n'),
            author: authorMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
          };
        }
        
        // Look for letter
        const letterMatch = cleanedResponse.match(/"letter"\s*:\s*"((?:[^"\\]|\\[\s\S])*)"/);
        if (letterMatch) {
          return {
            letter: letterMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
          };
        }
      } catch (extractError) {
        console.warn('Failed to extract content manually:', extractError);
      }
      
      return null;
    }
  }
  async generateQuote(userData: UserFormData, language: string = 'en'): Promise<string> {
    const mood = userData.mood === 'other' ? userData.customMood : userData.mood;
    const languageInstruction = language === 'tr' 
      ? 'Please respond in Turkish (Türkçe).' 
      : 'Please respond in English.';
    
    const prompt = `${languageInstruction} Generate an inspirational quote from a well-known historical figure that would be appropriate for someone named ${userData.name} ${userData.surname}, who is feeling ${mood}. 

IMPORTANT: Please respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{"quote": "The actual quote text here", "author": "Name of the historical figure"}

Make sure the quote is genuine and historically accurate, and that it addresses the person's current mood in a comforting and inspiring way. Ensure the JSON is properly formatted with escaped quotes if needed.`;

    return await this.makeRequestWithRetry(prompt, this.quoteModel);
  }

  async generateLetter(userData: UserFormData, language: string = 'en'): Promise<string> {
    const mood = userData.mood === 'other' ? userData.customMood : userData.mood;
    const age = new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear();
    const languageInstruction = language === 'tr' 
      ? 'Please respond in Turkish (Türkçe). Sign the letter as "İç Sesiniz" at the end.' 
      : 'Please respond in English. Sign the letter as "Your Inner Voice" at the end.';
    
    const prompt = `${languageInstruction} Write a personalized, comforting letter for ${userData.name}, who is approximately ${age} years old and is currently feeling ${mood}. 

The letter should be:
- Warm and empathetic
- Personally addressing their current emotional state
- Offering genuine comfort and encouragement
- About 2-3 paragraphs long
- Written in a caring, supportive tone

IMPORTANT: Please respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{"letter": "The complete letter content here including proper signature"}

Make the letter feel personal and heartfelt, as if written by a caring friend who truly understands their situation. Ensure the JSON is properly formatted with escaped quotes and newlines if needed.`;

    return await this.makeRequestWithRetry(prompt, this.letterModel);
  }

  async generateResponse(userData: UserFormData, language: string = 'en'): Promise<AIResponse> {
    try {
      const [quoteResponse, letterResponse] = await Promise.all([
        this.generateQuote(userData, language),
        this.generateLetter(userData, language),
      ]);

      let quote, letter;
      
      // Parse quote response
      const quoteData = this.parseJsonResponse(quoteResponse);
      if (quoteData && typeof quoteData.quote === 'string' && typeof quoteData.author === 'string') {
        quote = {
          text: quoteData.quote,
          author: quoteData.author,
        };
      } else {
        // Fallback: try to extract quote manually
        quote = {
          text: quoteResponse.replace(/```json|```/g, '').trim(),
          author: 'Historical Figure',
        };
      }

      // Parse letter response
      const letterData = this.parseJsonResponse(letterResponse);
      if (letterData && typeof letterData.letter === 'string') {
        letter = {
          content: letterData.letter,
        };
      } else {
        // Fallback: use the raw response
        letter = {
          content: letterResponse.replace(/```json|```/g, '').trim(),
        };
      }

      return { quote, letter };
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }

  private async makeChatRequestWithRetry(
    message: string,
    systemPrompt: string,
    conversationHistory: Array<{role: string, content: string}>,
    language: string
  ): Promise<string> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await this.makeChatRequest(message, systemPrompt, conversationHistory, language);
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry for certain error types
        if (error instanceof APIAuthenticationError || 
            error instanceof APIQuotaExceededError) {
          throw error;
        }
        
        // Don't retry on the last attempt
        if (attempt === this.maxRetries) {
          break;
        }
        
        // Calculate delay for exponential backoff
        let delay = this.calculateRetryDelay(attempt);
        
        // For rate limit errors, use the retry-after value if available
        if (error instanceof APIRateLimitError && error.retryAfter) {
          delay = error.retryAfter * 1000; // Convert seconds to milliseconds
        }
        
        console.log(`Chat request failed (attempt ${attempt + 1}/${this.maxRetries + 1}), retrying in ${delay}ms:`, lastError.message);
        await this.sleep(delay);
      }
    }
    
    // If we get here, all retries failed
    throw lastError || new Error('Chat request failed after all retry attempts');
  }

  private async makeChatRequest(
    message: string,
    systemPrompt: string,
    conversationHistory: Array<{role: string, content: string}>,
    language: string
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'InnerVoice Chat',
      },
      body: JSON.stringify({
        model: this.letterModel, // Use the same model as letters for consistency
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...conversationHistory,
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 800,
        temperature: 0.8, // Slightly higher temperature for more natural conversation
      }),
    });

    // Enhanced error handling for chat requests
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      switch (response.status) {
        case 401:
          throw new APIAuthenticationError('Invalid API key or authentication failed');
        case 402:
          throw new APIQuotaExceededError('API quota exceeded. Please check your OpenRouter account.');
        case 429:
          const retryAfter = parseInt(response.headers.get('retry-after') || '60');
          throw new APIRateLimitError(
            `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
            retryAfter
          );
        case 500:
        case 502:
        case 503:
        case 504:
          throw new APIServiceUnavailableError('OpenRouter service is temporarily unavailable. Please try again later.');
        default:
          throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}${errorData.error ? ` - ${errorData.error.message || errorData.error}` : ''}`);
      }
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || (language === 'tr' 
      ? "Buradayım ve seni dinliyorum, ama şu anda doğru kelimeleri bulmakta zorlanıyorum. Aklından geçenleri bana biraz daha anlatabilir misin?"
      : "I'm here for you, but I'm having trouble finding the right words right now. Can you tell me more about what's on your mind?");
  }

  async generateChatResponse(
    message: string,
    userContext: UserFormData,
    messageHistory: ChatMessage[],
    language: string = 'en'
  ): Promise<string> {
    const mood = userContext.mood === 'other' ? userContext.customMood : userContext.mood;
    const age = new Date().getFullYear() - new Date(userContext.dateOfBirth).getFullYear();
    
    const languageInstruction = language === 'tr' 
      ? 'Please respond in Turkish (Türkçe).' 
      : 'Please respond in English.';
    
    // Build conversation context
    const conversationHistory = messageHistory
      .filter(msg => msg.id !== 'welcome') // Exclude welcome message from history
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    const systemPrompt = `${languageInstruction} You are ${userContext.name}'s inner voice - their most compassionate, wise, and supportive inner companion. You know ${userContext.name} deeply and care about their wellbeing.

Key context about ${userContext.name}:
- Name: ${userContext.name} ${userContext.surname}
- Age: approximately ${age} years old
- Current mood: ${mood}
- You are having an ongoing conversation with them

Your role as their inner voice:
- Be empathetic, caring, and genuinely supportive
- Speak as if you truly know and understand them
- Offer comfort, wisdom, and gentle guidance
- Help them process their feelings and thoughts
- Be conversational and natural, not overly formal
- Remember you are their INNER voice, not an external therapist
- Use their name occasionally to make it personal
- Draw on the conversation history to maintain context

Respond naturally and conversationally to their message while staying true to being their supportive inner voice.`;

    try {
      return await this.makeChatRequestWithRetry(message, systemPrompt, conversationHistory, language);
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw error;
    }
  }
}
