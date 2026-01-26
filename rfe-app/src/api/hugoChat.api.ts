import config from '../config';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Suggestion {
  text: string;
  category: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  data?: {
    reply: string;
    gradeLevel: string | null;
  };
}

export interface SuggestionsResponse {
  success: boolean;
  message?: string;
  data?: {
    suggestions: Suggestion[];
    gradeLevel: string | null;
  };
}

async function apiRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'An error occurred',
      ...data,
    };
  }

  return data;
}

export const hugoChatApi = {
  // Send a message to Hugo AI
  async sendMessage(
    token: string,
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatResponse> {
    return apiRequest<ChatResponse>('/hugo-chat', token, {
      method: 'POST',
      body: JSON.stringify({ message, conversationHistory }),
    });
  },

  // Get suggested questions based on grade level
  async getSuggestions(token: string): Promise<SuggestionsResponse> {
    return apiRequest<SuggestionsResponse>('/hugo-chat/suggestions', token);
  },
};

export default hugoChatApi;
