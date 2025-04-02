import { vi } from 'vitest';

// Mock TextEncoder
global.TextEncoder = class {
  encode(text: string): Uint8Array {
    return new Uint8Array(Buffer.from(text));
  }
};

// Mock ReadableStreamDefaultController
global.ReadableStreamDefaultController = class {
  enqueue = vi.fn();
  close = vi.fn();
} as any;

// Silence console during tests
console.error = vi.fn();
console.warn = vi.fn(); 