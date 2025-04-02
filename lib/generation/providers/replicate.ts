import Replicate from 'replicate';
import { 
  GenerationOptions, 
  GenerationProvider, 
  GenerationResult,
  GenerationError,
  ProviderConfig 
} from '../types';

export class ReplicateProvider implements GenerationProvider {
  private client: Replicate;
  private modelId: string;
  
  constructor(config: ProviderConfig) {
    if (!config.apiKey) {
      throw new GenerationError(
        'Replicate API key is required',
        'CONFIG_ERROR',
        'replicate'
      );
    }
    
    this.client = new Replicate({
      auth: config.apiKey,
    });
    
    this.modelId = config.modelId || "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";
  }
  
  id = 'replicate';
  name = 'Replicate';
  description = 'Image generation using Replicate API';
  
  async generate(options: GenerationOptions): Promise<GenerationResult> {
    try {
      const prediction = await this.client.run(
        this.modelId,
        {
          input: {
            prompt: options.prompt,
            num_outputs: options.numOutputs || 1,
            width: options.width || 1024,
            height: options.height || 1024,
            scheduler: "K_EULER",
            num_inference_steps: options.steps || 50,
            negative_prompt: options.negativePrompt,
            seed: options.seed,
          }
        }
      );
      
      return {
        id: prediction.id,
        status: 'processing',
        metadata: {
          modelId: this.modelId,
          provider: 'replicate',
        }
      };
    } catch (error) {
      throw new GenerationError(
        error instanceof Error ? error.message : 'Generation failed',
        'GENERATION_ERROR',
        'replicate',
        { error }
      );
    }
  }
  
  async getStatus(id: string): Promise<GenerationResult> {
    try {
      const prediction = await this.client.predictions.get(id);
      
      return {
        id: prediction.id,
        status: this.mapStatus(prediction.status),
        output: prediction.output || undefined,
        progress: prediction.progress?.percentage || 0,
        error: prediction.error || undefined,
        metadata: {
          modelId: this.modelId,
          provider: 'replicate',
          metrics: prediction.metrics,
        }
      };
    } catch (error) {
      throw new GenerationError(
        error instanceof Error ? error.message : 'Failed to get status',
        'STATUS_ERROR',
        'replicate',
        { error }
      );
    }
  }
  
  async cancelGeneration(id: string): Promise<void> {
    try {
      await this.client.predictions.cancel(id);
    } catch (error) {
      throw new GenerationError(
        error instanceof Error ? error.message : 'Failed to cancel generation',
        'CANCEL_ERROR',
        'replicate',
        { error }
      );
    }
  }
  
  getSupportedFeatures(): string[] {
    return [
      'negative_prompt',
      'seed',
      'steps',
      'width',
      'height',
      'multiple_outputs',
      'cancellation'
    ];
  }
  
  async validateOptions(options: GenerationOptions): Promise<boolean> {
    if (!options.prompt) return false;
    if (options.width && (options.width < 512 || options.width > 2048)) return false;
    if (options.height && (options.height < 512 || options.height > 2048)) return false;
    if (options.steps && (options.steps < 1 || options.steps > 100)) return false;
    if (options.numOutputs && (options.numOutputs < 1 || options.numOutputs > 4)) return false;
    return true;
  }
  
  getDefaultOptions(): Partial<GenerationOptions> {
    return {
      width: 1024,
      height: 1024,
      steps: 50,
      numOutputs: 1,
    };
  }
  
  private mapStatus(status: string): GenerationResult['status'] {
    switch (status) {
      case 'starting':
        return 'started';
      case 'processing':
        return 'processing';
      case 'succeeded':
        return 'succeeded';
      case 'failed':
        return 'failed';
      default:
        return 'processing';
    }
  }
} 