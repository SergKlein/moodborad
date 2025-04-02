import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, GET } from '../route';
import { ReplicateService } from '@/lib/replicate/service';
import { NextRequest } from 'next/server';
import { GenerationResult, GenerationStatus } from '@/lib/replicate/types';

// Mock ReplicateService
vi.mock('@/lib/replicate/service', () => {
  return {
    ReplicateService: vi.fn().mockImplementation(() => ({
      createPrediction: vi.fn(),
      streamPrediction: vi.fn(),
    })),
  };
});

// Mock Response
const originalResponse = global.Response;
const mockResponse = vi.fn();

beforeEach(() => {
  global.Response = mockResponse as any;
  global.Response.json = vi.fn().mockImplementation((data, init) => {
    return new originalResponse(JSON.stringify(data), {
      ...init,
      headers: {
        ...init?.headers,
        'content-type': 'application/json',
      },
    });
  });
});

afterEach(() => {
  global.Response = originalResponse;
});

// Mock next/server
vi.mock('next/server', () => ({
  NextRequest: vi.fn().mockImplementation((input: string | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    return Object.assign(request, {
      nextUrl: new URL(input),
      cookies: {
        get: vi.fn(),
        getAll: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
      },
    });
  }),
  NextResponse: {
    json: vi.fn().mockImplementation((data: any, init?: ResponseInit) => Response.json(data, init))
  }
}));

describe('Image Generation API', () => {
  let service: ReplicateService;

  beforeEach(() => {
    service = new ReplicateService({ apiKey: 'test', modelVersion: 'test' });
    vi.clearAllMocks();
  });

  describe('POST /api/ai/image', () => {
    const validInput = {
      prompt: 'test prompt',
    };

    it('should create a prediction successfully', async () => {
      const mockResult: GenerationResult = {
        id: 'test-id',
        status: 'started',
      };

      vi.mocked(service.createPrediction).mockResolvedValueOnce(mockResult);

      const request = new NextRequest('http://localhost/api/ai/image', {
        method: 'POST',
        body: JSON.stringify(validInput),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toEqual({
        success: true,
        id: mockResult.id,
        status: mockResult.status,
      });
      
      expect(service.createPrediction).toHaveBeenCalledWith(validInput);
    });

    it('should validate input', async () => {
      const request = new NextRequest('http://localhost/api/ai/image', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data).toEqual({
        success: false,
        error: 'Invalid input',
        details: expect.any(Array),
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      vi.mocked(service.createPrediction).mockRejectedValueOnce(error);

      const request = new NextRequest('http://localhost/api/ai/image', {
        method: 'POST',
        body: JSON.stringify(validInput),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
      
      const data = await response.json();
      expect(data).toEqual({
        success: false,
        error: 'Service error',
      });
    });
  });

  describe('GET /api/ai/image', () => {
    it('should require prediction ID', async () => {
      const request = new NextRequest('http://localhost/api/ai/image');
      const response = await GET(request);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data).toEqual({
        success: false,
        error: 'Missing prediction ID',
      });
    });

    it('should stream prediction updates', async () => {
      const updates = [
        { status: 'processing' as GenerationStatus },
        { status: 'succeeded' as GenerationStatus },
      ];

      vi.mocked(service.streamPrediction).mockImplementation(async (controller) => {
        for (const update of updates) {
          const chunk = new TextEncoder().encode(JSON.stringify(update) + '\n');
          controller.enqueue(chunk);
          // Small delay to prevent test from hanging
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        controller.close();
      });

      const url = new URL('http://localhost/api/ai/image');
      url.searchParams.set('id', 'test-id');
      const request = new NextRequest(url);

      mockResponse.mockImplementation((body, init) => {
        return new originalResponse(body, init);
      });

      const response = await GET(request);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');

      const reader = response.body?.getReader();
      expect(reader).toBeDefined();

      const receivedUpdates: any[] = [];
      
      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += new TextDecoder().decode(value);
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.trim()) {
              receivedUpdates.push(JSON.parse(line));
            }
          }
        }
      }

      expect(receivedUpdates).toEqual(updates);
      expect(service.streamPrediction).toHaveBeenCalledWith(expect.any(Object), 'test-id');
    }, { timeout: 30000 });

    it('should handle streaming errors', async () => {
      const error = { success: false, error: 'Stream error' };

      vi.mocked(service.streamPrediction).mockImplementation(async (controller) => {
        const chunk = new TextEncoder().encode(JSON.stringify(error) + '\n');
        controller.enqueue(chunk);
        // Small delay to prevent test from hanging
        await new Promise(resolve => setTimeout(resolve, 10));
        controller.close();
      });

      const url = new URL('http://localhost/api/ai/image');
      url.searchParams.set('id', 'test-id');
      const request = new NextRequest(url);

      mockResponse.mockImplementation((body, init) => {
        return new originalResponse(body, init);
      });

      const response = await GET(request);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');

      const reader = response.body?.getReader();
      expect(reader).toBeDefined();

      const updates: any[] = [];
      
      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += new TextDecoder().decode(value);
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.trim()) {
              updates.push(JSON.parse(line));
            }
          }
        }
      }

      expect(updates).toEqual([error]);
      expect(service.streamPrediction).toHaveBeenCalledWith(expect.any(Object), 'test-id');
    }, { timeout: 30000 });
  });
}); 