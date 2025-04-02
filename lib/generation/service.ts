import { 
  GenerationOptions, 
  GenerationProvider, 
  GenerationResult,
  GenerationError,
  ProviderConfig 
} from './types';
import { ReplicateProvider } from './providers/replicate';

export class GenerationService {
  private providers: Map<string, GenerationProvider> = new Map();
  private defaultProvider: string;
  
  constructor(config: Record<string, ProviderConfig>) {
    // Initialize providers
    if (config.replicate) {
      this.registerProvider(new ReplicateProvider(config.replicate));
    }
    
    // Set default provider
    this.defaultProvider = Object.keys(config)[0];
    
    if (!this.defaultProvider) {
      throw new GenerationError(
        'No providers configured',
        'CONFIG_ERROR',
        'service'
      );
    }
  }
  
  registerProvider(provider: GenerationProvider) {
    this.providers.set(provider.id, provider);
  }
  
  getProvider(id?: string): GenerationProvider {
    const providerId = id || this.defaultProvider;
    const provider = this.providers.get(providerId);
    
    if (!provider) {
      throw new GenerationError(
        `Provider ${providerId} not found`,
        'PROVIDER_NOT_FOUND',
        'service'
      );
    }
    
    return provider;
  }
  
  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const provider = this.getProvider(options.provider);
    
    // Validate options
    const isValid = await provider.validateOptions(options);
    if (!isValid) {
      throw new GenerationError(
        'Invalid generation options',
        'VALIDATION_ERROR',
        provider.id
      );
    }
    
    // Apply default options
    const defaultOptions = provider.getDefaultOptions();
    const finalOptions = { ...defaultOptions, ...options };
    
    return provider.generate(finalOptions);
  }
  
  async getStatus(id: string, providerId: string): Promise<GenerationResult> {
    const provider = this.getProvider(providerId);
    return provider.getStatus(id);
  }
  
  async cancelGeneration(id: string, providerId: string): Promise<void> {
    const provider = this.getProvider(providerId);
    
    if (!provider.cancelGeneration) {
      throw new GenerationError(
        'Provider does not support cancellation',
        'UNSUPPORTED_OPERATION',
        provider.id
      );
    }
    
    await provider.cancelGeneration(id);
  }
  
  getProviders(): Array<{ id: string; name: string; description: string }> {
    return Array.from(this.providers.values()).map(provider => ({
      id: provider.id,
      name: provider.name,
      description: provider.description
    }));
  }
  
  getSupportedFeatures(providerId?: string): string[] {
    const provider = this.getProvider(providerId);
    return provider.getSupportedFeatures();
  }
} 