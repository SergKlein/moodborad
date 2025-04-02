"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "./ui/separator"

const footerLinks = [
  {
    title: "Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Portfolio", href: "/portfolio" }
    ]
  },
  {
    title: "Who We Help",
    links: [
      { label: "Developers", href: "/for-developers" },
      { label: "Realtors", href: "/for-realtors" },
      { label: "Architects", href: "/for-architects" },
      { label: "Investors", href: "/for-investors" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Request a Quote", href: "/quote" },
      { label: "Contact Us", href: "/contact" }
    ]
  }
]

export function Footer() {
  return (
    <footer className="bg-muted/50 py-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
            <div className="flex gap-4">
              <Button>Get a Quote</Button>
              <Button variant="outline">Our Projects</Button>
            </div>
          </div>
          <div className="relative h-40 lg:h-auto rounded-lg overflow-hidden">
            {/* This would be a styled background or image */}
            <div className="absolute inset-0 bg-primary/10 rounded-lg" />
          </div>
        </div>
        
        <Separator className="mb-12" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="font-bold text-xl mb-6 inline-block">
              cnstrct.ai
            </Link>
            <p className="text-sm text-muted-foreground">
              Helping You Build and Sell Better
            </p>
          </div>
          
          {footerLinks.map((group, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <Separator className="mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>Copyright © cnstrct.ai</p>
          <p>Operated by AI Products and Solutions Inc.</p>
        </div>
      </div>
    </footer>
  )
} 