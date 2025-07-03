import { UserFormData, AIResponse } from '@/types';

export class OpenRouterAPI {
  private apiKey: string;
  private baseUrl: string;
  private quoteModel: string;
  private letterModel: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    this.quoteModel = process.env.OPENROUTER_MODEL_QUOTE || 'anthropic/claude-3-haiku:beta';
    this.letterModel = process.env.OPENROUTER_MODEL_LETTER || 'anthropic/claude-3-haiku:beta';
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

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
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
      // If JSON parsing fails, try to extract content manually
      console.warn('Failed to parse JSON response:', error);
      return null;
    }
  }
  async generateQuote(userData: UserFormData): Promise<string> {
    const mood = userData.mood === 'other' ? userData.customMood : userData.mood;
    const prompt = `Generate an inspirational quote from a well-known historical figure that would be appropriate for someone named ${userData.name} ${userData.surname}, who is feeling ${mood}. 

Please respond in this exact JSON format:
{
  "quote": "The actual quote text here",
  "author": "Name of the historical figure"
}

Make sure the quote is genuine and historically accurate, and that it addresses the person's current mood in a comforting and inspiring way.`;

    return await this.makeRequest(prompt, this.quoteModel);
  }

  async generateLetter(userData: UserFormData): Promise<string> {
    const mood = userData.mood === 'other' ? userData.customMood : userData.mood;
    const age = new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear();
    
    const prompt = `Write a personalized, comforting letter for ${userData.name}, who is approximately ${age} years old and is currently feeling ${mood}. 

The letter should be:
- Warm and empathetic
- Personally addressing their current emotional state
- Offering genuine comfort and encouragement
- About 2-3 paragraphs long
- Written in a caring, supportive tone

Please respond in this exact JSON format:
{
  "letter": "The complete letter content here"
}

Make the letter feel personal and heartfelt, as if written by a caring friend who truly understands their situation.`;

    return await this.makeRequest(prompt, this.letterModel);
  }

  async generateResponse(userData: UserFormData): Promise<AIResponse> {
    try {
      const [quoteResponse, letterResponse] = await Promise.all([
        this.generateQuote(userData),
        this.generateLetter(userData),
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
}
