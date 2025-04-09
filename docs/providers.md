# Image Generation System Documentation

## Overview

The image generation system is designed with a modular, provider-based architecture that supports multiple AI image generation services. The current implementation includes Replicate as the default provider, with an extensible framework for adding additional providers like OpenAI in the future.

## Table of Contents

- [Image Generation System Documentation](#image-generation-system-documentation)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
    - [System Requirements](#system-requirements)
    - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Core Components](#core-components)
    - [Types and Interfaces](#types-and-interfaces)
    - [Provider Interface](#provider-interface)
    - [Generation Service](#generation-service)
  - [Implementation Details](#implementation-details)
    - [Provider Architecture](#provider-architecture)
    - [API Endpoints](#api-endpoints)
      - [Start Generation](#start-generation)
      - [Monitor Progress](#monitor-progress)
    - [Error Handling](#error-handling)
  - [Features](#features)
    - [Provider Management](#provider-management)
    - [Generation Options](#generation-options)
    - [Real-time Updates](#real-time-updates)
    - [Error Handling](#error-handling-1)
  - [Usage Examples](#usage-examples)
    - [Basic Generation](#basic-generation)
    - [Provider Selection](#provider-selection)
    - [Status Monitoring](#status-monitoring)
  - [Configuration](#configuration)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Debug Tips](#debug-tips)
  - [Security](#security)
    - [API Key Management](#api-key-management)
    - [Rate Limiting](#rate-limiting)
    - [Input Validation](#input-validation)
  - [Future Improvements](#future-improvements)

## Prerequisites

### System Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0.0
- Next.js >= 14.0.0

### Environment Variables

```bash
# Required environment variables
REPLICATE_API_TOKEN=your-replicate-api-token
REPLICATE_MODEL_ID=your-model-id

# Optional environment variables
OPENAI_API_KEY=your-openai-api-key # If using OpenAI provider
```

## Installation

1. Install the required dependencies:

```bash
pnpm add replicate openai
```

2. Configure the generation service:

```typescript
// src/lib/generation/config.ts
import { GenerationService } from './service';

export const generationService = new GenerationService({
  replicate: {
    apiKey: process.env.REPLICATE_API_TOKEN,
    modelId: process.env.REPLICATE_MODEL_ID,
  }
});
```

## Core Components

### Types and Interfaces

```typescript
// src/lib/generation/types.ts

// Core generation options
interface GenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  numOutputs?: number;
  negativePrompt?: string;
  seed?: number;
  steps?: number;
  provider?: string;
}

// Generation result structure
interface GenerationResult {
  id: string;
  status: GenerationStatus;
  output?: string[];
  error?: string;
  progress?: number;
  metadata?: Record<string, any>;
}
```

### Provider Interface

Each provider must implement the `GenerationProvider` interface:

- Core methods:
  - `generate`: Start image generation
  - `getStatus`: Check generation status
  - `cancelGeneration`: Cancel ongoing generation

- Feature support:
  - `getSupportedFeatures`: List provider capabilities
  - `validateOptions`: Validate generation options
  - `getDefaultOptions`: Get provider defaults

- Provider metadata:
  - `id`: Unique provider identifier
  - `name`: Display name
  - `description`: Provider description

### Generation Service

Centralized service that:

- Manages provider registration and selection
- Handles option validation and defaults
- Provides unified error handling
- Supports provider-specific features

## Implementation Details

### Provider Architecture

```typescript
// src/lib/generation/service.ts
class GenerationService {
  private providers: Map<string, GenerationProvider>;
  private defaultProvider: string;
  
  // Provider management
  registerProvider(provider: GenerationProvider)
  getProvider(id?: string): GenerationProvider
  
  // Core functionality
  async generate(options: GenerationOptions): Promise<GenerationResult>
  async getStatus(id: string, providerId: string): Promise<GenerationResult>
  async cancelGeneration(id: string, providerId: string): Promise<void>
}
```

### API Endpoints

#### Start Generation
```typescript
// src/app/api/generation/route.ts
POST /api/generation
Content-Type: application/json

{
  "prompt": "A beautiful sunset",
  "width": 1024,
  "height": 1024,
  "provider": "replicate" // optional
}
```

#### Monitor Progress
```typescript
// Server-Sent Events endpoint
GET /api/generation?sessionId={id}&providerId={provider}
```

### Error Handling

```typescript
// src/lib/generation/types.ts
class GenerationError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider: string,
    public details?: Record<string, any>
  )
}
```

## Features

### Provider Management

- Multiple provider support
- Provider-specific configuration
- Default provider fallback
- Feature detection

### Generation Options

- Prompt-based generation
- Size customization
- Multiple outputs
- Negative prompts
- Seed control
- Step count adjustment

### Real-time Updates

- SSE-based progress tracking
- Status monitoring
- Error reporting
- Cancellation support

### Error Handling

- Provider-specific errors
- Validation errors
- Configuration errors
- Network errors

## Usage Examples

### Basic Generation

```typescript
// src/app/generation/page.tsx
const result = await generationService.generate({
  prompt: "A beautiful sunset",
  width: 1024,
  height: 1024
});
```

### Provider Selection

```typescript
// src/app/generation/page.tsx
const result = await generationService.generate({
  prompt: "Mountain landscape",
  provider: "replicate",
  steps: 50
});
```

### Status Monitoring

```typescript
// src/components/generation/ImageGeneration.tsx
const status = await generationService.getStatus(
  generationId,
  providerId
);
```

## Configuration

```typescript
// src/lib/generation/config.ts
const service = new GenerationService({
  replicate: {
    apiKey: process.env.REPLICATE_API_TOKEN,
    modelId: process.env.REPLICATE_MODEL_ID
  }
});
```

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Error: "Replicate API key is required"
   - Solution: Ensure REPLICATE_API_TOKEN is set in environment variables

2. **Generation Failures**
   - Error: "Generation failed"
   - Solution: Check provider status and quota limits

3. **Connection Issues**
   - Error: "Connection lost"
   - Solution: Implement retry logic with exponential backoff

### Debug Tips

- Enable debug logging
- Monitor SSE connection status
- Check provider quotas
- Validate input parameters

## Security

### API Key Management

- Store keys in environment variables
- Never expose keys in client-side code
- Rotate keys periodically
- Use key encryption at rest

### Rate Limiting

- Implement per-user limits
- Add global rate limiting
- Monitor usage patterns
- Set up alerts for abuse

### Input Validation

- Sanitize all user inputs
- Validate image dimensions
- Check prompt content
- Implement request size limits

## Future Improvements

1. **Additional Providers**
   - OpenAI DALL-E integration
   - Stable Diffusion integration
   - Custom model support

2. **Performance Optimization**
   - Result caching
   - Request queuing
   - Rate limiting

3. **Enhanced Features**
   - Image manipulation
   - Style transfer
   - Batch processing
   - Advanced customization

4. **Monitoring and Analytics**
   - Usage tracking
   - Performance metrics
   - Error reporting
   - Cost optimization 