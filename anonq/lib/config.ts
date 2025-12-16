export interface ApiConfig {
  provider: 'openai' | 'custom';
  url: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

class ConfigService {
  private static instance: ConfigService;

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  getNtfyUrl(): string | undefined {
    return process.env.NTFY_URL || process.env.NEXT_PUBLIC_NTFY_URL;
  }

  getApiConfig(): ApiConfig | null {
    const provider = process.env.API_PROVIDER || 'openai';

    if (provider === 'custom') {
      const customUrl = process.env.CUSTOM_API_URL;
      const customKey = process.env.CUSTOM_API_KEY;
      const customModel = process.env.CUSTOM_API_MODEL || 'gpt-3.5-turbo';

      if (!customUrl || !customKey) {
        return null;
      }

      return {
        provider: 'custom',
        url: customUrl,
        apiKey: customKey,
        model: customModel,
        maxTokens: parseInt(process.env.CUSTOM_API_MAX_TOKENS || '1000'),
        temperature: parseFloat(process.env.CUSTOM_API_TEMPERATURE || '0.7'),
      };
    }

    // OpenAI configuration
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return null;
    }

    return {
      provider: 'openai',
      url: 'https://api.openai.com/v1',
      apiKey: openaiKey,
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    };
  }

  getPort(): number {
    return parseInt(process.env.PORT || '1337');
  }

  getAdminPasswordHash(): string {
    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      throw new Error('ADMIN_PASSWORD_HASH environment variable is required');
    }
    return hash;
  }

  // Helper method to validate required environment variables
  validateEnvironment(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!process.env.ADMIN_PASSWORD_HASH) {
      errors.push('ADMIN_PASSWORD_HASH is required');
    }

    const config = this.getApiConfig();
    if (!config) {
      errors.push('API configuration is incomplete');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export { ConfigService };