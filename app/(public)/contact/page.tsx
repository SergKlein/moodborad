import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react'; // Example icons
import { Label } from '@/components/ui/label'; // Assuming shadcn/ui
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  // TODO: Add state management and form submission logic here
  // const handleSubmit = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   // Handle form submission
  // };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Title */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Contact Us
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          We'd love to hear from you! Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Information Section */}
        <section className="lg:col-span-1">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h2>
          <div className="space-y-6">
            {/* Address */}
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-foreground">Our Office</h3>
                <p className="text-muted-foreground">
                  123 Moodboard Lane<br />
                  Design City, DC 12345<br />
                  United States
                  {/* TODO: Replace with your actual address */}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3">
              <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-foreground">Email Us</h3>
                <a href="mailto:hello@moodboard.app" className="text-muted-foreground hover:text-primary transition-colors">
                  hello@moodboard.app
                  {/* TODO: Replace with your actual email */}
                </a>
                 <p className="text-sm text-muted-foreground/80">We typically respond within 24 hours.</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-3">
              <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-foreground">Call Us</h3>
                <a href="tel:+11234567890" className="text-muted-foreground hover:text-primary transition-colors">
                  +1 (123) 456-7890
                  {/* TODO: Replace with your actual phone number */}
                </a>
                <p className="text-sm text-muted-foreground/80">Mon-Fri, 9am - 5pm EST</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Send Us a Message</h2>
          {/* TODO: Replace form with a server action or API call */}
          <form className="space-y-6" /* onSubmit={handleSubmit} */>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="Your Name" required />
              </div>
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" type="text" placeholder="How can we help?" required />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Please enter your message here." rows={5} required />
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" size="lg" className="w-full sm:w-auto rounded-full">
                Send Message
              </Button>
              {/* TODO: Add loading/success/error states */}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
