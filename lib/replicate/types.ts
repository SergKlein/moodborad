export type GenerationStatus = 
  | 'idle' 
  | 'started' 
  | 'processing' 
  | 'succeeded' 
  | 'failed';

export interface GenerationInput {
  prompt: string;
  negative_prompt?: string;
  num_outputs?: number;
  width?: number;
  height?: number;
  scheduler?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
}

export interface GenerationResult {
  id: string;
  status: GenerationStatus;
  output?: string[];
  error?: string;
  logs?: string;
  progress?: number;
  eta?: number;
  currentStep?: string;
}

export interface GenerationError {
  message: string;
  code: string;
  details?: any;
}

export interface ReplicateConfig {
  apiKey: string;
  modelVersion: string;
  maxRetries?: number;
  pollingInterval?: number;
  timeout?: number;
} 