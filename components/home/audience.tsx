"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { images } from "@/lib/home/image-paths"

const audienceTypes = [
  {
    title: "Realtors",
    description: "We empower real estate agents with stunning visualizations and streamlined processes, allowing you to focus on closing deals and impressing clients."
  },
  {
    title: "Developers",
    description: "Enhance project management and decision-making with our detailed renderings and advanced tools, designed to improve clarity and minimize costly adjustments."
  },
  {
    title: "Architects",
    description: "Ensure seamless project flow with our precise visualizations, helping you address potential issues early and present a clear vision to clients, reducing delays and miscommunications."
  },
  {
    title: "Investors",
    description: "See your investment take shape with a clear vision before committing to a costly endeavor."
  }
]

export function Audience() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="flex flex-col-reverse lg:flex-row gap-12 items-center mb-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6">How We Can Help You Thrive</h2>
            <div className="flex gap-4">
              <Button>Get a Quote</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
          <div className="lg:w-1/2 relative aspect-video w-full rounded-lg overflow-hidden">
            <Image 
              src={images.home.features.residentialDesign}
              alt="Construction and real estate photo-realistic and immersive visualization"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audienceTypes.map((audience, index) => (
            <Card key={index} className="bg-background/80 backdrop-blur shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">{audience.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {audience.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 