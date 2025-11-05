export interface Message {
  id: string;
  content: string;
  context?: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface ChatResponse {
  response: string;
  error?: string;
}
