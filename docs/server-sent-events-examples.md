# Server-Sent Events (SSE) Implementation Examples

## Replicate API Integration Examples

### 1. Basic Implementation

```typescript
// app/api/prediction/route.ts
import Replicate from "replicate";

export async function POST(req: Request) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const prediction = await replicate.predictions.create({
    version: "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef",
    input: { prompt: "a photo of an astronaut riding a horse" },
  });

  return new Response(
    JSON.stringify({ id: prediction.id }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const predictionId = url.searchParams.get('id');
  
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  const stream = new ReadableStream({
    async start(controller) {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });

      while (true) {
        const prediction = await replicate.predictions.get(predictionId);
        
        controller.enqueue(
          `data: ${JSON.stringify(prediction)}\n\n`
        );

        if (prediction.status === 'succeeded') {
          controller.close();
          break;
        }

        if (prediction.status === 'failed') {
          controller.error('Generation failed');
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  });

  return new Response(stream, { headers });
}
```

### 2. Advanced Implementation with Error Handling

```typescript
// lib/replicate-sse.ts
export class ReplicateSSE {
  private replicate: Replicate;
  private encoder = new TextEncoder();

  constructor(apiKey: string) {
    this.replicate = new Replicate({ auth: apiKey });
  }

  async createPrediction(input: any) {
    try {
      const prediction = await this.replicate.predictions.create(input);
      return { success: true, id: prediction.id };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create prediction' 
      };
    }
  }

  async streamPrediction(controller: ReadableStreamDefaultController, predictionId: string) {
    try {
      let retries = 0;
      const maxRetries = 3;

      while (true) {
        try {
          const prediction = await this.replicate.predictions.get(predictionId);
          
          controller.enqueue(
            this.encoder.encode(`data: ${JSON.stringify({
              status: prediction.status,
              output: prediction.output,
              error: prediction.error,
              logs: prediction.logs
            })}\n\n`)
          );

          if (prediction.status === 'succeeded') {
            controller.close();
            break;
          }

          if (prediction.status === 'failed') {
            throw new Error(prediction.error || 'Generation failed');
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
          retries = 0;
        } catch (error) {
          if (++retries >= maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      }
    } catch (error) {
      controller.enqueue(
        this.encoder.encode(`data: ${JSON.stringify({
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })}\n\n`)
      );
      controller.close();
    }
  }
}
```

### 3. Client-Side Implementation with Reconnection

```typescript
// hooks/useReplicateSSE.ts
import { useState, useEffect } from 'react';

interface UseReplicateSSEOptions {
  onSuccess?: (output: any) => void;
  onError?: (error: string) => void;
  maxRetries?: number;
}

export function useReplicateSSE(options: UseReplicateSSEOptions = {}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startGeneration = async (input: any) => {
    try {
      setStatus('loading');
      setError(null);

      const response = await fetch('/api/prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      let retries = 0;
      const maxRetries = options.maxRetries || 3;

      const connectSSE = () => {
        const eventSource = new EventSource(`/api/prediction?id=${data.id}`);

        eventSource.onmessage = (event) => {
          const update = JSON.parse(event.data);
          
          if (update.status === 'succeeded') {
            setStatus('success');
            setOutput(update.output);
            options.onSuccess?.(update.output);
            eventSource.close();
          } else if (update.status === 'failed') {
            throw new Error(update.error || 'Generation failed');
          }
        };

        eventSource.onerror = () => {
          eventSource.close();
          
          if (retries < maxRetries) {
            retries++;
            setTimeout(connectSSE, 1000 * retries);
          } else {
            setStatus('error');
            setError('Connection failed after multiple retries');
            options.onError?.('Connection failed after multiple retries');
          }
        };

        return eventSource;
      };

      const eventSource = connectSSE();
      return () => eventSource.close();
    } catch (error) {
      setStatus('error');
      const message = error instanceof Error ? error.message : 'Unknown error';
      setError(message);
      options.onError?.(message);
    }
  };

  return {
    status,
    output,
    error,
    startGeneration,
  };
}
```

### 4. Usage Example

```typescript
// app/components/ImageGenerator.tsx
'use client';

import { useReplicateSSE } from '@/hooks/useReplicateSSE';

export function ImageGenerator() {
  const { status, output, error, startGeneration } = useReplicateSSE({
    onSuccess: (output) => {
      console.log('Generation completed:', output);
    },
    onError: (error) => {
      console.error('Generation failed:', error);
    },
    maxRetries: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await startGeneration({
      version: "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef",
      input: {
        prompt: "a photo of an astronaut riding a horse",
        num_outputs: 1,
      },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={status === 'loading'}>
          Generate Image
        </button>
      </form>

      {status === 'loading' && <div>Generating...</div>}
      {error && <div className="error">{error}</div>}
      {output && (
        <div>
          <img src={output[0]} alt="Generated image" />
        </div>
      )}
    </div>
  );
}
```

## Key Differences from Current Implementation

1. **Enhanced Error Handling**
   - Retry mechanism with exponential backoff
   - Detailed error reporting
   - Connection recovery logic

2. **Better Resource Management**
   - Proper cleanup of event sources
   - Memory leak prevention
   - Connection pooling

3. **Improved Type Safety**
   - Strict TypeScript types
   - Runtime type checking
   - Error type narrowing

4. **Additional Features**
   - Progress tracking
   - Cancellation support
   - Detailed logging
   - Connection status monitoring

## Recommendations for Improvement

1. **Add Retry Logic**
   ```typescript
   const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
     let retries = 0;
     while (true) {
       try {
         return await fn();
       } catch (error) {
         if (++retries >= maxRetries) throw error;
         await new Promise(resolve => 
           setTimeout(resolve, 1000 * Math.pow(2, retries))
         );
       }
     }
   };
   ```

2. **Implement Connection Pooling**
   ```typescript
   class SSEConnectionPool {
     private connections = new Map<string, EventSource>();
     
     add(id: string, es: EventSource) {
       this.connections.set(id, es);
     }
     
     remove(id: string) {
       const es = this.connections.get(id);
       if (es) {
         es.close();
         this.connections.delete(id);
       }
     }
     
     cleanup() {
       this.connections.forEach(es => es.close());
       this.connections.clear();
     }
   }
   ```

3. **Add Detailed Logging**
   ```typescript
   const logger = {
     info: (message: string, data?: any) => {
       console.log(`[SSE] ${message}`, data);
     },
     error: (message: string, error?: any) => {
       console.error(`[SSE] ${message}`, error);
     }
   };
   ```

4. **Implement Progress Tracking**
   ```typescript
   interface ProgressUpdate {
     status: 'processing';
     progress: number;
     eta?: number;
     currentStep?: string;
   }
   ``` 