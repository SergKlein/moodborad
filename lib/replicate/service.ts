import Replicate from 'replicate';
import { 
  GenerationInput, 
  GenerationResult, 
  GenerationError, 
  ReplicateConfig 
} from './types';

export class ReplicateService {
  private replicate: Replicate;
  private encoder = new TextEncoder();
  private config: Required<ReplicateConfig>;

  constructor(config: ReplicateConfig) {
    this.replicate = new Replicate({
      auth: config.apiKey,
    });

    this.config = {
      ...config,
      maxRetries: config.maxRetries ?? 3,
      pollingInterval: config.pollingInterval ?? 1000,
      timeout: config.timeout ?? 5 * 60 * 1000, // 5 minutes
    };
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = this.config.maxRetries
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (i === retries - 1) throw lastError;
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, i) * this.config.pollingInterval)
        );
      }
    }

    throw lastError!;
  }

  async createPrediction(input: GenerationInput): Promise<GenerationResult> {
    try {
      const prediction = await this.retryWithBackoff(() => 
        this.replicate.predictions.create({
          version: this.config.modelVersion,
          input: {
            prompt: input.prompt,
            negative_prompt: input.negative_prompt,
            num_outputs: input.num_outputs || 1,
            width: input.width || 1024,
            height: input.height || 1024,
            scheduler: input.scheduler || 'K_EULER',
            num_inference_steps: input.num_inference_steps || 50,
            guidance_scale: input.guidance_scale || 7.5,
          },
        })
      );

      return {
        id: prediction.id,
        status: 'started',
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPredictionStatus(id: string): Promise<GenerationResult> {
    try {
      const prediction = await this.retryWithBackoff(() =>
        this.replicate.predictions.get(id)
      );

      return {
        id: prediction.id,
        status: this.mapStatus(prediction.status),
        output: prediction.output,
        error: prediction.error,
        logs: prediction.logs,
        progress: this.calculateProgress(prediction),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async streamPrediction(
    controller: ReadableStreamDefaultController,
    id: string
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      while (true) {
        const result = await this.getPredictionStatus(id);
        
        controller.enqueue(
          this.encoder.encode(`data: ${JSON.stringify(result)}\n\n`)
        );

        if (result.status === 'succeeded' || result.status === 'failed') {
          break;
        }

        if (Date.now() - startTime > this.config.timeout) {
          throw new Error('Generation timeout');
        }

        await new Promise(resolve => 
          setTimeout(resolve, this.config.pollingInterval)
        );
      }
    } catch (error) {
      controller.enqueue(
        this.encoder.encode(`data: ${JSON.stringify({
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })}\n\n`)
      );
    } finally {
      controller.close();
    }
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

  private calculateProgress(prediction: any): number {
    if (!prediction.logs) return 0;
    
    const match = prediction.logs.match(/(\d+)%/);
    if (match) {
      return parseInt(match[1], 10) / 100;
    }
    
    return 0;
  }

  private handleError(error: unknown): GenerationError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'GENERATION_ERROR',
        details: error,
      };
    }

    return {
      message: 'Unknown error occurred',
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }
} 