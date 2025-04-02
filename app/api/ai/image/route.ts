import { NextRequest } from 'next/server';
import { ReplicateService } from '@/lib/replicate/service';
import { GenerationInput } from '@/lib/replicate/types';
import { z } from 'zod';

const replicateService = new ReplicateService({
  apiKey: process.env.REPLICATE_API_TOKEN!,
  modelVersion: process.env.REPLICATE_MODEL_VERSION!,
});

const inputSchema = z.object({
  prompt: z.string().min(1).max(1000),
  negative_prompt: z.string().optional(),
  num_outputs: z.number().min(1).max(4).optional(),
  width: z.number().min(512).max(1024).optional(),
  height: z.number().min(512).max(1024).optional(),
  scheduler: z.string().optional(),
  num_inference_steps: z.number().min(1).max(100).optional(),
  guidance_scale: z.number().min(1).max(20).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = inputSchema.parse(body);
    
    const result = await replicateService.createPrediction(input);

    return Response.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { 
          success: false, 
          error: 'Invalid input', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { success: false, error: 'Missing prediction ID' },
        { status: 400 }
      );
    }

    const headers = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    };

    const stream = new ReadableStream({
      async start(controller) {
        await replicateService.streamPrediction(controller, id);
      },
    });

    return new Response(stream, { headers });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 