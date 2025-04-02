import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReplicateService } from '../service';
import { GenerationInput, GenerationResult } from '../types';
import type { Status, Prediction } from 'replicate';

// Mock Replicate
vi.mock('replicate', () => {
  return {
    default: class MockReplicate {
      predictions = {
        create: vi.fn(),
        get: vi.fn(),
      };
    },
  };
});

describe('ReplicateService', () => {
  let service: ReplicateService;
  const mockConfig = {
    apiKey: 'test-key',
    modelVersion: 'test-version',
  };

  beforeEach(() => {
    service = new ReplicateService(mockConfig);
    vi.clearAllMocks();
  });

  describe('createPrediction', () => {
    const mockInput: GenerationInput = {
      prompt: 'test prompt',
    };

    it('should create a prediction successfully', async () => {
      const mockPrediction: Prediction = {
        id: 'test-id',
        status: 'starting' as Status,
        model: 'test-model',
        version: mockConfig.modelVersion,
        input: mockInput,
        output: null,
        source: 'api' as const,
        created_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        completed_at: undefined,
        logs: '',
        error: null,
        metrics: {},
        urls: {
          get: 'https://api.replicate.com/v1/predictions/test-id',
          cancel: 'https://api.replicate.com/v1/predictions/test-id/cancel',
        },
      };

      vi.mocked(service['replicate'].predictions.create).mockResolvedValueOnce(mockPrediction);

      const result = await service.createPrediction(mockInput);

      expect(result).toEqual({
        id: 'test-id',
        status: 'started',
      });
    });

    it('should handle errors during prediction creation', async () => {
      const error = new Error('API Error');
      vi.mocked(service['replicate'].predictions.create).mockRejectedValueOnce(error);

      let thrown = false;
      try {
        await service.createPrediction(mockInput);
      } catch (err) {
        thrown = true;
        expect(err).toEqual({
          message: error.message,
          code: 'GENERATION_ERROR',
          details: error,
        });
      }
      expect(thrown).toBe(true);
    });

    it('should retry on failure', async () => {
      const error = new Error('Temporary error');
      const mockPrediction: Prediction = {
        id: 'test-id',
        status: 'starting' as Status,
        model: 'test-model',
        version: mockConfig.modelVersion,
        input: mockInput,
        output: null,
        source: 'api' as const,
        created_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        completed_at: undefined,
        logs: '',
        error: null,
        metrics: {},
        urls: {
          get: 'https://api.replicate.com/v1/predictions/test-id',
          cancel: 'https://api.replicate.com/v1/predictions/test-id/cancel',
        },
      };
      
      vi.mocked(service['replicate'].predictions.create)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(mockPrediction);

      const result = await service.createPrediction(mockInput);

      expect(result).toEqual({
        id: 'test-id',
        status: 'started',
      });
      expect(service['replicate'].predictions.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('getPredictionStatus', () => {
    const predictionId = 'test-id';

    it('should get prediction status successfully', async () => {
      const mockPrediction: Prediction = {
        id: predictionId,
        status: 'processing' as Status,
        model: 'test-model',
        version: mockConfig.modelVersion,
        input: { prompt: 'test' },
        output: null,
        source: 'api' as const,
        created_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        completed_at: undefined,
        logs: '50% complete',
        error: null,
        metrics: {},
        urls: {
          get: 'https://api.replicate.com/v1/predictions/test-id',
          cancel: 'https://api.replicate.com/v1/predictions/test-id/cancel',
        },
      };

      vi.mocked(service['replicate'].predictions.get).mockResolvedValueOnce(mockPrediction);

      const result = await service.getPredictionStatus(predictionId);

      expect(result).toMatchObject({
        id: predictionId,
        status: 'processing',
        output: null,
        logs: '50% complete',
        progress: 0.5,
      });
    });

    it('should handle completed predictions', async () => {
      const mockPrediction: Prediction = {
        id: predictionId,
        status: 'succeeded' as Status,
        model: 'test-model',
        version: mockConfig.modelVersion,
        input: { prompt: 'test' },
        output: ['image-url'],
        source: 'api' as const,
        created_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        logs: '100% complete',
        error: null,
        metrics: {},
        urls: {
          get: 'https://api.replicate.com/v1/predictions/test-id',
          cancel: 'https://api.replicate.com/v1/predictions/test-id/cancel',
        },
      };

      vi.mocked(service['replicate'].predictions.get).mockResolvedValueOnce(mockPrediction);

      const result = await service.getPredictionStatus(predictionId);

      expect(result).toMatchObject({
        id: predictionId,
        status: 'succeeded',
        output: ['image-url'],
        logs: '100% complete',
        progress: 1,
      });
    });

    it('should handle failed predictions', async () => {
      const mockPrediction: Prediction = {
        id: predictionId,
        status: 'failed' as Status,
        model: 'test-model',
        version: mockConfig.modelVersion,
        input: { prompt: 'test' },
        output: null,
        source: 'api' as const,
        created_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        logs: 'Error occurred',
        error: 'Generation failed',
        metrics: {},
        urls: {
          get: 'https://api.replicate.com/v1/predictions/test-id',
          cancel: 'https://api.replicate.com/v1/predictions/test-id/cancel',
        },
      };

      vi.mocked(service['replicate'].predictions.get).mockResolvedValueOnce(mockPrediction);

      const result = await service.getPredictionStatus(predictionId);

      expect(result).toMatchObject({
        id: predictionId,
        status: 'failed',
        error: 'Generation failed',
        logs: 'Error occurred',
        progress: 0,
      });
    });
  });

  describe('streamPrediction', () => {
    const predictionId = 'test-id';
    let mockController: ReadableStreamDefaultController;

    beforeEach(() => {
      mockController = new ReadableStreamDefaultController();
    });

    it('should stream prediction updates', async () => {
      const mockPredictions: [Prediction, Prediction] = [
        {
          id: predictionId,
          status: 'processing' as Status,
          model: 'test-model',
          version: mockConfig.modelVersion,
          input: { prompt: 'test' },
          output: null,
          source: 'api' as const,
          created_at: new Date().toISOString(),
          started_at: new Date().toISOString(),
          completed_at: undefined,
          logs: '50% complete',
          error: null,
          metrics: {},
          urls: {
            get: 'https://api.replicate.com/v1/predictions/test-id',
            cancel: 'https://api.replicate.com/v1/predictions/test-id/cancel',
          },
        },
        {
          id: predictionId,
          status: 'succeeded' as Status,
          model: 'test-model',
          version: mockConfig.modelVersion,
          input: { prompt: 'test' },
          output: ['image-url'],
          source: 'api' as const,
          created_at: new Date().toISOString(),
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          logs: '100% complete',
          error: null,
          metrics: {},
          urls: {
            get: 'https://api.replicate.com/v1/predictions/test-id',
            cancel: 'https://api.replicate.com/v1/predictions/test-id/cancel',
          },
        },
      ];

      vi.mocked(service['replicate'].predictions.get)
        .mockResolvedValueOnce(mockPredictions[0])
        .mockResolvedValueOnce(mockPredictions[1]);

      await service.streamPrediction(mockController, predictionId);

      expect(mockController.enqueue).toHaveBeenCalledTimes(2);
      expect(mockController.close).toHaveBeenCalled();
    });

    it('should handle streaming errors', async () => {
      const error = new Error('Stream error');
      vi.mocked(service['replicate'].predictions.get).mockRejectedValueOnce(error);

      await service.streamPrediction(mockController, predictionId);

      expect(mockController.enqueue).toHaveBeenCalledWith(
        expect.any(Uint8Array)
      );
      expect(mockController.close).toHaveBeenCalled();
    });

    it('should handle timeout', async () => {
      vi.useFakeTimers();
      const mockPrediction: Prediction = {
        id: predictionId,
        status: 'processing' as Status,
        model: 'test-model',
        version: mockConfig.modelVersion,
        input: { prompt: 'test' },
        output: null,
        source: 'api' as const,
        created_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        completed_at: undefined,
        logs: 'Still processing',
        error: null,
        metrics: {},
        urls: {
          get: 'https://api.replicate.com/v1/predictions/test-id',
          cancel: 'https://api.replicate.com/v1/predictions/test-id/cancel',
        },
      };

      vi.mocked(service['replicate'].predictions.get).mockResolvedValue(mockPrediction);

      const streamPromise = service.streamPrediction(mockController, predictionId);
      vi.advanceTimersByTime(5 * 60 * 1000 + 1000); // Timeout + 1 second

      await streamPromise;

      expect(mockController.enqueue).toHaveBeenCalledWith(
        expect.any(Uint8Array)
      );
      expect(mockController.close).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });
}); 