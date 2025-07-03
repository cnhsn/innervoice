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
