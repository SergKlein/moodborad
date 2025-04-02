import { NextResponse } from 'next/server';
import { GenerationService } from '@/lib/generation/service';
import { GenerationError } from '@/lib/generation/types';

// Initialize the generation service
const generationService = new GenerationService({
  replicate: {
    apiKey: process.env.REPLICATE_API_TOKEN,
    modelId: process.env.REPLICATE_MODEL_ID,
  }
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, ...options } = body;

    const result = await generationService.generate({
      prompt,
      ...options
    });

    return NextResponse.json({ 
      success: true, 
      sessionId: result.id,
      providerId: result.metadata?.provider || 'replicate'
    });
  } catch (error) {
    console.error('Generation error:', error);
    
    if (error instanceof GenerationError) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          code: error.code 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Generation failed' },
      { status: 500 }
    );
  }
}

// SSE endpoint for progress updates
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');
  const providerId = url.searchParams.get('providerId') || 'replicate';

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID required' },
      { status: 400 }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Initial status
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'started' })}\n\n`));

        // Poll for status
        while (true) {
          const result = await generationService.getStatus(sessionId, providerId);
          
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(result)}\n\n`)
          );
          
          if (result.status === 'succeeded' || result.status === 'failed') {
            controller.close();
            break;
          }
          
          // Wait before next check
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            status: 'failed', 
            error: errorMessage 
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