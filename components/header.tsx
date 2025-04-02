"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black">
      <div className="container relative flex h-16 items-center justify-between">
        {/* Company Logo */}
        <Link href="/" className="flex items-center ml-[120px]">
          <Image 
            src="/design/assets/logos/company_logo.svg" 
            alt="Company Logo" 
            width={180} 
            height={53} 
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Product Name - Centered */}
        <Link 
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center"
        >
          <div className="flex items-center">
            <span className="text-lg font-bold text-white">moodboard</span>
            <span className="text-lg font-bold text-yellow-400">[ai]</span>
            <span className="ml-1.5 rounded-md bg-white/10 px-1.5 py-0.5 text-xs font-medium text-white/60">beta</span>
          </div>
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            asChild 
            variant="outline" 
            size="sm" 
            className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white min-w-[100px]"
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button 
            asChild 
            size="sm" 
            className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-full min-w-[100px] mr-[20px]"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
} 