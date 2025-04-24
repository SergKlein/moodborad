// /api/generation/design
// POST
// Params:
/*
    image?: string; // base image if it needs to be edited or mask
    designType?: string; // Interior, Exterior, Garden
    intervention?: number; // 0 - 10 (0 is no AI intervention, 10 is a complete redesign with a new concept)
    numberOfImages?: number; // 1 - 4
    style?: string | string[]; // e.g., 'Modern', ['Scandinavian', 'Minimalist']
    colors?: string[]; // RGB strings e.g., ['rgb(R, G, B)']
    textures?: string[]; // e.g., ['wood', 'metal']
    roomType?: string; // Bedroom, Living Room, Kitchen, Bathroom, etc.
    spaces?: string[];
    ideas?: string[];
    aspectRatio?: '1:1' | '16:9' | '9:16';
    userId?: string; // To track usage
    toolType?: 'design' | 'redisign' | 'textures' | 'restyle' | 'recolor' | 'referenced';
*/ 

// Response:
/*
success: boolean;
    imageUrl?: string;
    error?: string;
    usage?: { tokens: number; credits: number };
*/ 

// Use Replicate Api service and OpenAI Api service
// use config for get model, model params, api key
// use zod for params validation
// use openai api for image generation
// use replicate api for image generation
// use openai api for image inpainting
// use openai api for image upscaling
// use replicate api for image upscaling
// use replicate api for image inpainting

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { staticGenerationConfig } from '@/config/generation';

const schema = z.object({ 
    image: z.string().optional(),
    designType: z.string().optional(),
    intervention: z.number().optional(),
    numberOfImages: z.number().optional(),
    style: z.string().optional(),
    colors: z.array(z.string()).optional(), 
    textures: z.array(z.string()).optional(),
    roomType: z.string().optional(),
    spaces: z.array(z.string()).optional(),
    ideas: z.array(z.string()).optional(),
    aspectRatio: z.enum(['1:1', '16:9', '9:16', '3:2', '2:3', '4:5', '5:4', '3:4', '4:3']).optional(),
    userId: z.string().optional(),
    toolType: z.enum(['design', 'redisign', 'textures', 'restyle', 'recolor', 'referenced']).optional(),    
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { success, error } = schema.safeParse(body);
    
    if (!success) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    // TODO: Implement the design generation logic. Use service to generate the design.

    return NextResponse.json({ success: true, message: "Design generation started" }, { status: 200 });
}

