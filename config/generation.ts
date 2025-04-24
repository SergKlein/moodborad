interface GenerationConfig {
  provider: string;
  model: ModelConfig;
}

interface ModelConfig {
  tool: string;
  model: string;
  modelParams: Record<string, string>;
}

interface StaticGenerationConfig {
  // Default config for each service
  defaultConfig: {
    imageDesign: GenerationConfig;
    ideaGeneration: GenerationConfig;
  };
  // Provider details (API Key source, Base URL)
  providers: Record<string, {
    provider: string;
    apiKeyEnvVar: string; // Name of the env var for the key
    baseUrl?: string;
    // Basic model list might still be useful for validation or UI selectors
    availableModels?: ModelConfig[];
  }>;
}

export const staticGenerationConfig: StaticGenerationConfig = {
  defaultConfig: {
    imageDesign: {
      provider: 'replicate', // Global default provider
      model: {
        tool: 'design',
        model: 'black-forest-labs/flux-1.1-pro',
        modelParams: {
            prompt: '',
            image_prompt: '',
            aspect_ratio: '1:1', // 1:1, 16:9, 4:3, 3:4, 9:16, 1:2, 2:1
            safety_tolerance: '1', // 1-6
            width: '1024',
            height: '1024',
            seed: '0',
            output_format: 'png', // png, jpg, webp
            output_quality: '80', // 1-100
        },
      },
    },
    ideaGeneration: {
      provider: 'openai',
      model: {
        tool: 'idea',
        model: 'gpt-4o',
        modelParams: {
            prompt: '',
            temperature: '0.8',
            top_p: '0.9',
            presence_penalty: '0.6',
            frequency_penalty: '0.0',
            max_tokens: '1000'
        },
      },
    },
  },
  providers: {
    openai: {
      provider: 'openai',
      apiKeyEnvVar: 'OPENAI_API_KEY',
      baseUrl: 'https://api.openai.com/v1',
      availableModels: [
        {
          tool: 'idea',
          model: 'gpt-4o',
          modelParams: {
                prompt: '',
                temperature: '0.8',
                top_p: '0.9',
                presence_penalty: '0.6',
                frequency_penalty: '0.0',
                max_tokens: '1000'
            },
        },
      ],
    },
    replicate: {
      provider: 'replicate',
      apiKeyEnvVar: 'REPLICATE_API_KEY',
      baseUrl: 'https://api.replicate.com/v1',
      availableModels: [
        {
          tool: 'design',
          model: 'black-forest-labs/flux-1.1-pro',
          modelParams: {
            prompt: '',
            image_prompt: '',
            aspect_ratio: '1:1', // 1:1, 16:9, 4:3, 3:4, 9:16, 1:2, 2:1
            safety_tolerance: '1', // 1-6
            width: '1024',
            height: '1024',
            seed: '0',
            output_format: 'png', // png, jpg, webp
            output_quality: '80', // 1-100
          },
        },
      ],
    },
  },
};

// Define LogicalServiceName type based on the defaultConfig keys
export type LogicalServiceName = keyof typeof staticGenerationConfig.defaultConfig;

// --- getGenerationServiceConfig function needs complete rewrite ---
// (See next step)
