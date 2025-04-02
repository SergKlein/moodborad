"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { images } from "@/lib/home/image-paths"

const services = [
  {
    title: "Immersive Visualizations",
    description: "Bring your properties to life with stunning visuals that captivate buyers and elevate your listings like never before.",
    link: "/services/immersive-visualizations",
    image: images.home.features.techVisualization
  },
  {
    title: "Architectural Incubation",
    description: "Empower your architecture firm with advanced resources and cutting-edge tools to streamline workflows and drive creativity.",
    link: "/services/architectural-incubation",
    image: images.home.features.residentialDesign
  },
  {
    title: "Construction End-to-End Consulting",
    description: "Optimize every phase of your construction project with expert consulting and advanced technology integration.",
    link: "/services/construction-consulting",
    image: images.home.features.techVisualization
  }
]

export function Services() {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">A Comprehensive Set of Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-video w-full">
                <Image 
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link 
                  href={service.link}
                  className="text-sm font-medium text-primary flex items-center group"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center gap-4">
          <Button>Get a Quote</Button>
          <Button variant="outline">Browse All Services</Button>
        </div>
      </div>
    </section>
  )
} 