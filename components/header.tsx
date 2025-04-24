"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, use, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUser } from "@/lib/auth";
import { signOut } from "@/app/(public)/(login)/actions";
import { Home, LogOut, Users, Settings, Activity, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard');

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push('/');
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          className={cn(
            "min-w-[100px]",
            isDashboard 
              ? "border-gray-200 hover:bg-gray-100 hover:text-gray-900" 
              : "border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          )}
        >
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button 
          asChild 
          size="sm" 
          className={cn(
            "bg-yellow-400 text-black hover:bg-yellow-500 min-w-[100px]",
            "rounded-full"
          )}
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring rounded-full">
        <Avatar className="cursor-pointer size-9 border border-border">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>
            {user.email
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          {user.email}
        </div>
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Добавленные пункты меню */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>Team</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/general" className="flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>General</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/activity" className="flex w-full items-center">
            <Activity className="mr-2 h-4 w-4" />
            <span>Activity</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/security" className="flex w-full items-center">
            <Shield className="mr-2 h-4 w-4" />
            <span>Security</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="w-full">
            <DropdownMenuItem className="w-full cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard');

  const publicNavItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b h-16",
      isDashboard ? "border-border bg-background" : "border-white/10 bg-black"
    )}>
      <div className="container h-full max-w-screen-2xl mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Левая часть: Лого */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-6">
            <Image 
              src="/design/assets/logos/company_logo.svg" 
              alt="Company Logo" 
              width={180} height={53} 
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Центрированное Название Продукта (остается здесь, позиционируется абсолютно) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <Link href="/" className="flex items-center">
            <span className={cn(
              "text-lg font-bold", 
              isDashboard ? "text-foreground" : "text-white"
            )}>
              moodboard
            </span>
            <span className="text-lg font-bold text-yellow-400">[ai]</span>
            <span className={cn(
              "ml-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
              isDashboard ? "bg-muted text-muted-foreground" : "bg-white/10 text-white/60"
            )}>
              beta
            </span>
          </Link>
        </div>

        {/* Правая часть: Навигация + Меню Пользователя */}
        <div className="flex items-center gap-x-4 md:gap-x-6"> {/* Используем gap-* для отступов */} 
          {/* --- Публичное Навигационное Меню --- */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center space-x-6 mr-6">
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-white" 
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          {/* --- Конец Публичного Меню --- */}

          {/* Авторизация или меню пользователя (теперь после навигации) */}
          <Suspense fallback={<div className="h-9 w-[120px]" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
} 