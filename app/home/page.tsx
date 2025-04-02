"use client"

import { Navbar } from "@/components/home/navbar"
import { Hero } from "@/components/home/hero"
import { Stats } from "@/components/home/stats"
import { Services } from "@/components/home/services"
import { CTA } from "@/components/home/cta"
import { Projects } from "@/components/home/projects"
import { Audience } from "@/components/home/audience"
import { Testimonials } from "@/components/home/testimonials"
import { Footer } from "@/components/home/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Stats />
        <Services />
        <CTA />
        <Projects />
        <Audience />
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  )
} 