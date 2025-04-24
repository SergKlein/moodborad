import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <main>
      <section className="py-16">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Helping You Build & Sell Better 
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                Transforming Real Estate and Home Building With Immersive Visualizations and Cutting-Edge Technology
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <a href="/" target="_blank">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className={cn(
                    "text-lg px-8 py-6 h-auto rounded-full inline-flex items-center justify-center",
                    "shadow-sm hover:shadow border-border"
                  )}
                >
                  Get Started
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
