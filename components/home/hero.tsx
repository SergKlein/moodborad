"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Image from "next/image"
import { images } from "@/lib/home/image-paths"

export function Hero() {
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="container flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mb-6">
          Helping You Build & Sell Better
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Transforming Real Estate and Home Building With Immersive Visualizations and Cutting-Edge Technology
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button size="lg">
            Get a Quote
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
        
        <div className="relative w-full aspect-video max-w-5xl rounded-lg overflow-hidden shadow-xl">
          <Image 
            src={images.home.hero.main}
            alt="Construction and real estate photo-realistic and immersive visualization"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <Button variant="ghost" size="icon" className="mt-12 animate-bounce">
          <ArrowDown className="h-6 w-6" />
          <span className="sr-only">Scroll Down</span>
        </Button>
      </div>
    </section>
  )
} 