import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ConfigService, ApiConfig } from '../config';

export interface CorrectionResponse {
  corrected: string;
  error?: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens: number;
  temperature: number;
}

interface ChatCompletionChoice {
  message: {
    content: string;
  };
}

interface ChatCompletionResponse {
  choices: ChatCompletionChoice[];
  text?: string;
  corrected?: string;
}

class ApiService {
  private static instance: ApiService;
  private configService: ConfigService;

  private constructor() {
    this.configService = ConfigService.getInstance();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async correctGrammar(content: string): Promise<CorrectionResponse> {
    const apiConfig = this.configService.getApiConfig();

    if (!apiConfig) {
      return {
        corrected: content,
        error: 'API not configured'
      };
    }

    try {
      let url = apiConfig.url;
      if (apiConfig.provider === 'openai') {
        url = 'https://api.openai.com/v1/chat/completions';
      } else if (!url.endsWith('/chat/completions') && !url.endsWith('/generate')) {
        url = `${url}/chat/completions`;
      }

      const requestConfig: AxiosRequestConfig = {
        method: 'POST',
        url: url,
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        data: this.buildRequestData(content, apiConfig),
        timeout: 30000,
      };

      const response = await axios(requestConfig);
      const corrected = this.extractCorrectedText(response, apiConfig.provider);

      return { corrected };
    } catch (error) {
      return {
        corrected: content,
        error: 'Correction service unavailable'
      };
    }
  }

  private buildRequestData(content: string, config: ApiConfig): ChatCompletionRequest {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: 'Please correct the grammar and spelling of the following text while preserving the original meaning. Do not change the tone or intent. Return only the corrected text, no additional commentary.'
    };

    const userMessage: ChatMessage = {
      role: 'user',
      content: content
    };

    return {
      model: config.model,
      messages: [systemMessage, userMessage],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    };
  }

  private extractCorrectedText(response: AxiosResponse<ChatCompletionResponse>, provider: string): string {
    try {
      if (provider === 'openai') {
        return response.data.choices[0].message.content.trim();
      }
      return response.data.choices?.[0]?.message?.content?.trim() ||
             response.data.text?.trim() ||
             response.data.corrected?.trim() ||
             '';
    } catch {
      throw new Error('Invalid API response format');
    }
  }

  async sendNotification(title: string, message: string): Promise<void> {
    const ntfyUrl = this.configService.getNtfyUrl();

    if (!ntfyUrl) {
      return;
    }

    try {
      await axios.post(ntfyUrl, {
        title,
        message,
        priority: 'high',
        tags: ['question'],
      }, {
        timeout: 10000,
      });
    } catch {
    }
  }
}

export { ApiService };
