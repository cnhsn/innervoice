export interface UserFormData {
  name: string;
  surname: string;
  dateOfBirth: string;
  mood: string;
  customMood?: string;
}

export interface Quote {
  text: string;
  author: string;
}

export interface Letter {
  content: string;
}

export interface AIResponse {
  quote: Quote;
  letter: Letter;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  messages: ChatMessage[];
  userContext: UserFormData;
}
