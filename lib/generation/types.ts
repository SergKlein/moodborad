export interface GenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  numOutputs?: number;
  negativePrompt?: string;
  seed?: number;
  steps?: number;
  provider?: string;
}

export interface GenerationResult {
  id: string;
  status: GenerationStatus;
  output?: string[];
  error?: string;
  progress?: number;
  metadata?: Record<string, any>;
}

export type GenerationStatus = 'started' | 'processing' | 'succeeded' | 'failed';

export interface ProviderConfig {
  apiKey?: string;
  apiUrl?: string;
  modelId?: string;
  organizationId?: string;
  [key: string]: any;
}

export interface GenerationProvider {
  id: string;
  name: string;
  description: string;
  
  // Core methods
  generate(options: GenerationOptions): Promise<GenerationResult>;
  getStatus(id: string): Promise<GenerationResult>;
  cancelGeneration?(id: string): Promise<void>;
  
  // Provider-specific features
  getSupportedFeatures(): string[];
  validateOptions(options: GenerationOptions): Promise<boolean>;
  getDefaultOptions(): Partial<GenerationOptions>;
}

export interface ProviderFeature {
  id: string;
  name: string;
  description: string;
  config?: Record<string, any>;
}

export class GenerationError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'GenerationError';
  }
} 