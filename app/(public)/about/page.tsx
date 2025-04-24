import React from 'react';
import { Building, Target, Lightbulb, Users } from 'lucide-react'; // Example icons

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          About Moodboard
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-xl text-muted-foreground">
          Revolutionizing Real Estate and Home Building with Immersive Visualizations and Cutting-Edge Technology.
        </p>
      </section>

      {/* Mission/Vision Section */}
      <section className="mb-16 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
        <div className="mb-8 lg:mb-0">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-4">
            To empower builders, designers, and real estate professionals by providing intuitive tools that transform ideas into stunning, interactive visual experiences. We aim to streamline the design, development, and sales process through innovative technology.
          </p>
          <p className="text-lg text-muted-foreground">
            We believe that visualizing the future is the key to building it better. Our platform bridges the gap between imagination and reality, making complex projects clear, collaborative, and compelling.
          </p>
        </div>
        {/* Optional Image or Illustration */}
        <div className="flex justify-center">
           <Building size={128} className="text-primary opacity-10" />
           {/* Replace with an actual relevant image/illustration */}
           {/* <img src="/images/about-mission.jpg" alt="Our Mission Visualization" className="rounded-lg shadow-md" /> */}
        </div>
      </section>

      {/* What We Do / Our Approach Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Approach</h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Item 1 */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Innovation First</h3>
            <p className="text-muted-foreground">
              We leverage the latest advancements in AI, 3D rendering, and web technologies to create tools that are not just functional, but transformative.
            </p>
          </div>
          {/* Item 2 */}
          <div className="text-center">
             <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Target className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">User-Centric Design</h3>
            <p className="text-muted-foreground">
              Our platform is built with the end-user in mind, focusing on intuitive workflows, ease of use, and powerful features that solve real-world problems.
            </p>
          </div>
          {/* Item 3 */}
          <div className="text-center">
             <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                 <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Collaborative Spirit</h3>
            <p className="text-muted-foreground">
              We foster collaboration by enabling seamless sharing, feedback, and iteration within design and sales teams, connecting stakeholders effectively.
            </p>
          </div>
        </div>
      </section>

       {/* Optional: Values or Team Section can be added here */}

      {/* Closing CTA (Optional) */}
      <section className="text-center mt-16 pt-12 border-t">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Transform Your Workflow?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the growing community of professionals using Moodboard to build and sell better.
          </p>
          {/* You can reuse the Button component from your design system */}
          {/* <Link href="/sign-up">
              <Button size="lg" className="rounded-full">Get Started Today</Button>
          </Link> */}
      </section>

    </div>
  );
}
