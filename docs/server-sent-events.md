# Server-Sent Events (SSE) Implementation

## Overview

Our implementation uses Server-Sent Events (SSE) to provide real-time updates during the image generation process. This allows clients to receive continuous progress updates without polling, creating a more efficient and responsive user experience.

## Architecture

### Server-Side Implementation

```typescript
// app/api/generation/route.ts
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');
  const providerId = url.searchParams.get('providerId') || 'replicate';

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Initial status
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ status: 'started' })}\n\n`)
        );

        while (true) {
          const result = await generationService.getStatus(sessionId, providerId);
          
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(result)}\n\n`)
          );
          
          if (result.status === 'succeeded' || result.status === 'failed') {
            break;
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            status: 'failed', 
            error: error instanceof Error ? error.message : 'Unknown error'
          })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### Client-Side Implementation

```typescript
// components/generation/ImageGeneration.tsx
export function ImageGeneration() {
  const [status, setStatus] = useState<GenerationStatus | null>(null);

  const startGeneration = async () => {
    try {
      const response = await fetch('/api/generation', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      // Initialize SSE connection
      const eventSource = new EventSource(
        `/api/generation?sessionId=${data.sessionId}&providerId=${data.providerId}`
      );
      
      // Handle incoming messages
      eventSource.onmessage = (event) => {
        const update = JSON.parse(event.data);
        setStatus(update);
        
        if (update.status === 'succeeded' || update.status === 'failed') {
          eventSource.close();
        }
      };

      // Handle connection errors
      eventSource.onerror = () => {
        eventSource.close();
        setStatus({ status: 'failed', error: 'Connection lost' });
      };
    } catch (error) {
      setStatus({ 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Generation failed' 
      });
    }
  };
}
```

## Key Features

### 1. Real-Time Updates
- Continuous status updates
- Progress tracking
- Immediate error reporting
- Automatic connection management

### 2. Error Handling
- Connection errors
- Generation failures
- Provider-specific errors
- Graceful degradation

### 3. Resource Management
- Automatic connection cleanup
- Memory leak prevention
- Proper stream closing
- Error recovery

## Status Types

```typescript
type GenerationStatus = {
  status: 'started' | 'processing' | 'succeeded' | 'failed';
  progress?: number;
  output?: string[];
  error?: string;
};
```

## Best Practices

### 1. Connection Management
- Close connections when complete
- Handle reconnection scenarios
- Implement timeout handling
- Monitor connection health

### 2. Error Recovery
- Implement retry logic
- Provide fallback mechanisms
- Clear error messages
- Status persistence

### 3. Performance
- Optimize message frequency
- Minimize payload size
- Handle backpressure
- Monitor server resources

## Security Considerations

### 1. Authentication
- Validate session tokens
- Check user permissions
- Prevent unauthorized access
- Rate limit connections

### 2. Data Protection
- Sanitize status messages
- Validate session IDs
- Protect sensitive information
- Secure error messages

## Troubleshooting

### Common Issues

1. **Connection Drops**
   ```typescript
   eventSource.onerror = (error) => {
     console.error('SSE Error:', error);
     // Implement reconnection logic
     reconnect();
   };
   ```

2. **Memory Leaks**
   ```typescript
   useEffect(() => {
     const es = new EventSource(url);
     return () => {
       es.close(); // Clean up on unmount
     };
   }, [url]);
   ```

3. **Timeout Handling**
   ```typescript
   setTimeout(() => {
     if (eventSource.readyState === EventSource.OPEN) {
       eventSource.close();
       setStatus({ status: 'failed', error: 'Generation timeout' });
     }
   }, 5 * 60 * 1000); // 5 minutes timeout
   ```

## Testing

### Unit Tests

```typescript
describe('SSE Connection', () => {
  it('should handle successful generation', async () => {
    const eventSource = new EventSource(url);
    // Test implementation
  });

  it('should handle connection errors', async () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
describe('Generation Flow', () => {
  it('should complete full generation cycle', async () => {
    // Test implementation
  });
});
```

## Future Improvements

1. **Enhanced Features**
   - Batch update optimization
   - Progress estimation
   - Cancellation support
   - Pause/resume capability

2. **Performance Optimization**
   - Connection pooling
   - Message batching
   - Compression
   - Cache management

3. **Monitoring**
   - Connection metrics
   - Error tracking
   - Performance monitoring
   - Usage analytics 