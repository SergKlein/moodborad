"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { images } from "@/lib/home/image-paths"

const projects = [
  {
    id: "west-meade",
    title: "West Meade Estate",
    description: "Through immersive 3D renderings, we brought this 12,000 sq. ft. estate to life, allowing potential buyers to visualize its future allure even before construction was completed.",
    date: "Nov 2024",
    location: "Nashville, TN",
    service: "Immersive Visualizations, VR",
    image: images.home.projects.westMeadeEstate
  },
  {
    id: "miami-residence",
    title: "Miami Residence",
    description: "Mendel Fellig sought to showcase an unbuilt luxury waterfront estate on North Bay Road, one of Miami's most prestigious locations.‍Through our high-end renderings, we provided a stunning visual experience that not only illustrated the property's potential but also played a crucial role in achieving these strategic goals.",
    date: "Nov 2024",
    location: "Miami, FL",
    service: "Immersive Visualizations",
    image: images.home.projects.miamiResidence
  },
  {
    id: "leipers-fork",
    title: "Leiper's Fork Barn",
    description: "Our client sought to create a luxurious barn-style estate in Leiper's Fork, blending traditional charm with modern luxury for both family gatherings and Airbnb events.",
    date: "Nov 2024",
    location: "Leiper's Fork, TN",
    service: "Immersive Visualizations",
    image: images.home.projects.leipersForkBarn
  },
  {
    id: "connecticut-retreat",
    title: "Connecticut Retreat",
    description: "This stunning $22M estate in Greenwich, CT, underwent a transformative journey after being gutted to the studs.",
    date: "Nov 2024",
    location: "Greenwich, CT",
    service: "Immersive Visualizations",
    image: images.home.projects.greenwichRetreat
  }
]

export function Projects() {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold mb-2">Recent Projects</h2>
        <p className="text-lg text-muted-foreground mb-10">
          We help architects, designers and realtors sell their projects, elevate their brand, and attract new clients.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden border-0 shadow-lg">
              <div className="relative aspect-[4/3] w-full">
                <Image 
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
                
                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-muted-foreground">{project.date}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">{project.location}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Service</p>
                    <p className="text-muted-foreground">{project.service}</p>
                  </div>
                </div>
                
                <Link 
                  href={`/portfolio/${project.id}`}
                  className="inline-flex items-center text-sm font-medium text-primary"
                >
                  View project
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" size="lg">
            Browse Portfolio
          </Button>
        </div>
      </div>
    </section>
  )
} 