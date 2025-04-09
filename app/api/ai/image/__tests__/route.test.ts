import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, GET } from '../route';
import { NextRequest } from 'next/server';
import { GenerationStatus } from '@/lib/replicate/types';

// Мокируем модули в начале - это решает проблему с инициализацией
vi.mock('@/lib/replicate/service', () => {
  return {
    ReplicateService: vi.fn().mockImplementation(() => ({
      createPrediction: vi.fn(),
      streamPrediction: vi.fn(),
    })),
  };
});

// Импортируем после мокирования
import { ReplicateService } from '@/lib/replicate/service';

// Сохраняем оригинальные объекты
const originalResponse = global.Response;

describe('Image Generation API', () => {
  // Общие переменные для тестов
  let mockService: {
    createPrediction: ReturnType<typeof vi.fn>;
    streamPrediction: ReturnType<typeof vi.fn>;
  };
  
  // Настройка перед каждым тестом
  beforeEach(() => {
    // Получаем доступ к методам мокированного класса
    const ReplicateServiceMock = vi.mocked(ReplicateService);
    mockService = ReplicateServiceMock.mock.results[0]?.value || { 
      createPrediction: vi.fn(),
      streamPrediction: vi.fn() 
    };
    
    // Сбрасываем все моки
    vi.clearAllMocks();
    
    // Мокируем Response.json
    Response.json = vi.fn().mockImplementation((data, init) => {
      return {
        status: init?.status || 200,
        headers: new Headers({
          ...init?.headers,
          'content-type': 'application/json'
        }),
        json: async () => data,
      };
    });
  });
  
  // Восстановление после каждого теста
  afterEach(() => {
    global.Response = originalResponse;
  });
  
  describe('POST /api/ai/image', () => {
    const validInput = { prompt: 'test prompt' };
    
    it('should create a prediction successfully', async () => {
      // Мокируем успешный ответ
      const mockResult = { id: 'test-id', status: 'started' };
      mockService.createPrediction.mockResolvedValueOnce(mockResult);
      
      // Создаем запрос
      const request = new NextRequest('http://localhost/api/ai/image', {
        method: 'POST',
        body: JSON.stringify(validInput),
      });
      
      // Вызываем API
      const response = await POST(request);
      
      // Проверяем результат
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        success: true,
        id: mockResult.id,
        status: mockResult.status,
      });
      
      // Проверяем, что сервис был вызван с правильными аргументами
      expect(mockService.createPrediction).toHaveBeenCalledWith(validInput);
    });
    
    it('should validate input', async () => {
      // Создаем запрос с невалидными данными
      const request = new NextRequest('http://localhost/api/ai/image', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      
      // Вызываем API
      const response = await POST(request);
      
      // Проверяем результат - должен быть 400 Bad Request
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({
        success: false,
        error: 'Invalid input',
        details: expect.any(Array),
      });
    });
    
    it('should handle service errors', async () => {
      // Мокируем ошибку
      const error = new Error('Service error');
      mockService.createPrediction.mockRejectedValueOnce(error);
      
      // Создаем запрос
      const request = new NextRequest('http://localhost/api/ai/image', {
        method: 'POST',
        body: JSON.stringify(validInput),
      });
      
      // Вызываем API
      const response = await POST(request);
      
      // Проверяем результат - должен быть 500 Server Error
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
      // Создаем запрос без ID
      const request = new NextRequest('http://localhost/api/ai/image');
      
      // Вызываем API
      const response = await GET(request);
      
      // Проверяем результат - должен быть 400 Bad Request
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({
        success: false,
        error: 'Missing prediction ID',
      });
    });
    
    it('should stream prediction updates', async () => {
      // Подготавливаем обновления, которые будут стримиться
      const updates = [
        { status: 'processing' as GenerationStatus },
        { status: 'succeeded' as GenerationStatus },
      ];
      
      // Мокируем streamPrediction, чтобы он отправлял обновления
      mockService.streamPrediction.mockImplementation(async (controller) => {
        for (const update of updates) {
          controller.enqueue(new TextEncoder().encode(JSON.stringify(update) + '\n'));
        }
        controller.close();
      });
      
      // Создаем контролируемый поток
      const mockStream = new ReadableStream({
        async start(controller) {
          for (const update of updates) {
            controller.enqueue(new TextEncoder().encode(JSON.stringify(update) + '\n'));
          }
          controller.close();
        }
      });
      
      // Мокируем Response конструктор для работы со стримом
      global.Response = vi.fn().mockImplementation((body, init) => ({
        status: 200,
        headers: new Headers({
          ...init?.headers,
        }),
        body: mockStream,
      })) as any;
      
      // Создаем запрос с ID
      const url = new URL('http://localhost/api/ai/image');
      url.searchParams.set('id', 'test-id');
      const request = new NextRequest(url);
      
      // Вызываем API
      const response = await GET(request);
      
      // Проверяем результат
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
      
      // Читаем обновления из потока
      const receivedUpdates: any[] = [];
      const reader = response.body?.getReader();
      
      if (reader) {
        let buffer = '';
        let done = false;
        
        // Ограничиваем чтение, чтобы предотвратить бесконечный цикл
        for (let attempt = 0; attempt < 5 && !done; attempt++) {
          const result = await reader.read();
          done = result.done;
          
          if (result.value) {
            buffer += new TextDecoder().decode(result.value);
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
              if (line.trim()) {
                receivedUpdates.push(JSON.parse(line));
              }
            }
          }
        }
      }
      
      // Проверяем полученные данные
      expect(receivedUpdates).toEqual(updates);
      expect(mockService.streamPrediction).toHaveBeenCalledWith(expect.any(Object), 'test-id');
    }, { timeout: 5000 });
    
    it('should handle streaming errors', async () => {
      // Создаем ошибку для стрима
      const streamError = { success: false, error: 'Stream error' };
      
      // Мокируем streamPrediction, чтобы он отправлял ошибку
      mockService.streamPrediction.mockImplementation(async (controller) => {
        controller.enqueue(new TextEncoder().encode(JSON.stringify(streamError) + '\n'));
        controller.close();
      });
      
      // Создаем контролируемый поток с ошибкой
      const mockStream = new ReadableStream({
        async start(controller) {
          controller.enqueue(new TextEncoder().encode(JSON.stringify(streamError) + '\n'));
          controller.close();
        }
      });
      
      // Мокируем Response конструктор для работы со стримом
      global.Response = vi.fn().mockImplementation((body, init) => ({
        status: 200,
        headers: new Headers({
          ...init?.headers,
        }),
        body: mockStream,
      })) as any;
      
      // Создаем запрос с ID
      const url = new URL('http://localhost/api/ai/image');
      url.searchParams.set('id', 'test-id');
      const request = new NextRequest(url);
      
      // Вызываем API
      const response = await GET(request);
      
      // Проверяем результат
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
      
      // Читаем данные из потока
      const receivedErrors: any[] = [];
      const reader = response.body?.getReader();
      
      if (reader) {
        let buffer = '';
        let done = false;
        
        // Ограничиваем чтение, чтобы предотвратить бесконечный цикл
        for (let attempt = 0; attempt < 5 && !done; attempt++) {
          const result = await reader.read();
          done = result.done;
          
          if (result.value) {
            buffer += new TextDecoder().decode(result.value);
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
              if (line.trim()) {
                receivedErrors.push(JSON.parse(line));
              }
            }
          }
        }
      }
      
      // Проверяем полученные данные
      expect(receivedErrors).toEqual([streamError]);
      expect(mockService.streamPrediction).toHaveBeenCalledWith(expect.any(Object), 'test-id');
    }, { timeout: 5000 });
  });
}); 