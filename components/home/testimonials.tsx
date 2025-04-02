"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { images } from "@/lib/home/image-paths"

const testimonials = [
  {
    quote: "They transformed our marketing strategy",
    content: "Construct provided an outstanding solution when we came to them in need of help. In my many years in the industry, I've never witnessed such a remarkable surge in interest for a property as I did when we shared the renderings of this home on the MLS listing.",
    author: "Sarah Michaud",
    location: "Franklin, TN",
    image: images.home.testimonials.first
  },
  {
    quote: "Our client satisfaction has never been better",
    content: "Utilizing high-end architectural renderings streamlined our design process, minimizing back and forth while reducing errors. These visuals allowed our clients to see their vision clearly, enhancing collaboration and satisfaction.",
    author: "Ihor Zhuk",
    location: "Nashville, TN",
    image: images.home.testimonials.second
  },
  {
    quote: "Our clients fell in love with the virtual walk-through",
    content: "These gorgeous renderings and stunning virtual walk-throughs allowed potential buyers to envision their life in the home, creating an emotional connection before it was even constructed.",
    author: "Gretchen Coley",
    location: "Raleigh, NC",
    image: images.home.testimonials.third
  }
]

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say About Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 -z-10">
                <Image 
                  src={testimonial.image}
                  alt="Construction and real estate visualization"
                  fill
                  className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/60" />
              </div>
              
              <CardHeader className="pt-8">
                <h3 className="text-xl font-semibold text-center">{testimonial.quote}</h3>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground italic text-center">
                  "{testimonial.content}"
                </p>
              </CardContent>
              
              <CardFooter className="flex-col items-center pb-8">
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 