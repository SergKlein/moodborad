"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { images } from "@/lib/home/image-paths"

export function CTA() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Smart Tech That Makes Home Building Easier & More Efficient
            </h2>
            <p className="text-lg text-muted-foreground">
              Our team of experts pair cutting-edge technology with concierge level service to deliver top-tier visualizations that are faster, of higher quality, and more cost-effective than the industry standard.
            </p>
            <p className="text-lg text-muted-foreground">
              From a casual conversation to leading innovations in construction and real estate, our journey has always been about creating meaningful partnerships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button>Get a Quote</Button>
              <Button variant="outline">About Us</Button>
            </div>
          </div>
          
          <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-xl">
            <Image 
              src={images.home.features.techVisualization}
              alt="Construction and real estate photo-realistic and immersive visualization"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
} 