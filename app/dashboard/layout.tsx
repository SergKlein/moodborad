'use client';

import { use } from 'react';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container max-w-screen-2xl mx-auto px-4 md:px-6 py-6">
        {children}
      </main>
    </section>
  );
}
