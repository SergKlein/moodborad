"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface GenerationStatus {
  status: 'started' | 'processing' | 'succeeded' | 'failed';
  progress?: number;
  output?: string[];
  error?: string;
}

export function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const startGeneration = async () => {
    try {
      setStatus({ status: 'started' });
      
      // Start generation
      const response = await fetch('/api/generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      // Start listening for updates
      const eventSource = new EventSource(`/api/generation?sessionId=${data.sessionId}`);
      
      eventSource.onmessage = (event) => {
        const update = JSON.parse(event.data);
        setStatus(update);
        
        if (update.status === 'succeeded') {
          setGeneratedImage(update.output[0]);
          eventSource.close();
        } else if (update.status === 'failed') {
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setStatus({ status: 'failed', error: 'Connection lost' });
      };
    } catch (error) {
      setStatus({ status: 'failed', error: error instanceof Error ? error.message : 'Generation failed' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="flex-1"
        />
        <Button 
          onClick={startGeneration}
          disabled={!prompt || status?.status === 'processing'}
        >
          {status?.status === 'processing' && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Generate
        </Button>
      </div>

      {status && (
        <Card>
          <CardContent className="pt-6">
            {status.status === 'started' && (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="ml-2">Starting generation...</p>
              </div>
            )}

            {status.status === 'processing' && (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="ml-2">
                  Generating image... 
                  {status.progress && `${Math.round(status.progress * 100)}%`}
                </p>
              </div>
            )}

            {status.status === 'succeeded' && generatedImage && (
              <div className="relative h-64">
                <Image
                  src={generatedImage}
                  alt="Generated image"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            )}

            {status.status === 'failed' && (
              <div className="flex items-center justify-center h-64 text-red-500">
                <p>Generation failed: {status.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 