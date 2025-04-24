"use client"

import { Hero } from "@/components/home/hero"
import { Stats } from "@/components/home/stats"
import { Services } from "@/components/home/services"
import { CTA } from "@/components/home/cta"
import { Projects } from "@/components/home/projects"
import { Audience } from "@/components/home/audience"
import { Testimonials } from "@/components/home/testimonials"

// Переименуем компонент для ясности, т.к. это корневая страница
export default function RootPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <main className="flex-1 w-full max-w-4xl">
        <Hero />
        <Stats />
        <Testimonials />
      </main>
    </div>
  )
} 