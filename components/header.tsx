"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  Heart,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonaWidget } from "@/components/persona-widget";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { navConfig } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header id="seekrza-header" className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            {!logoError ? (
              <Image
                src="https://cdn.seekrza.com/brand/seekrza-logo.svg"
                alt="SeekrZA"
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
                onError={() => setLogoError(true)}
              />
            ) : (
                <span className="text-xl font-bold">SeekrZA</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <TooltipProvider>
            <NavigationMenu className="hidden lg:flex" viewport={false}>
              <NavigationMenuList>
                {navConfig.primaryNav.map((item) => {
                   const isActive = pathname.startsWith(item.href) && item.href !== "/";

                  if (item.type === "inline") {
                    return (
                      <NavigationMenuItem key={item.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                              <Link 
                                href={item.href}
                                className={cn(
                                  isActive && "bg-accent text-accent-foreground"
                                )}
                              >
                                {item.label}
                                {item.badge && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-2 h-5 rounded px-1.5 text-[0.6rem] font-bold text-primary"
                                  >
                                    {item.badge.text}
                                  </Badge>
                                )}
                              </Link>
                            </NavigationMenuLink>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </NavigationMenuItem>
                    );
                  }

                  if (item.type === "dropdown" && item.items) {
                    return (
                      <NavigationMenuItem key={item.id}>
                        <NavigationMenuTrigger className={cn(isActive && "bg-accent text-accent-foreground")}>
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[200px] gap-2 p-4">
                            {item.items.map((subItem) => (
                              <li key={subItem.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={subItem.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {subItem.label}
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  }

                  if (item.type === "mega" && item.columns) {
                    return (
                      <NavigationMenuItem key={item.id}>
                        <NavigationMenuTrigger className={cn(isActive && "bg-accent text-accent-foreground")}>
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[600px] grid-cols-3 gap-5 p-6">
                            {item.columns.map((col) => (
                              <div key={col.title} className="space-y-4">
                                <h4 className="font-medium leading-none">
                                  {col.title}
                                </h4>
                                <ul className="space-y-2">
                                  {col.links.map((link) => (
                                    <li key={link.href}>
                                      <NavigationMenuLink asChild>
                                        <Link
                                          href={link.href}
                                          className="text-sm text-muted-foreground hover:text-foreground"
                                        >
                                          {link.label}
                                        </Link>
                                      </NavigationMenuLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  }

                  return null;
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </TooltipProvider>
        </div>

        {/* Right Interactions */}
        <div className="flex items-center gap-2">
          {/* Utility Nav - Desktop */}
          <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/saved" aria-label="Saved properties">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/alerts" aria-label="Alerts">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>

            <PersonaWidget />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden lg:flex gap-1 px-2">
                  EN <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="?lang=en-ZA">English (ZA)</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="?lang=af-ZA">Afrikaans</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />
          </div>

          <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

          {/* Auth State */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.email || "User"}
                    />
                    <AvatarFallback>
                      {user.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/saved">Saved homes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/buyability">My BuyAbility</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Create account</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-100">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 py-6">
                {!user && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/auth/login">Sign in</Link>
                    </Button>
                    <Button asChild onClick={() => setIsOpen(false)}>
                      <Link href="/auth/sign-up">Sign up</Link>
                    </Button>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  {navConfig.mobile.sheetMenu.sections.map((section) => (
                    <div key={section.title} className="py-2">
                      <h4 className="mb-2 px-2 text-sm font-medium text-muted-foreground">
                        {section.title}
                      </h4>
                      {section.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block rounded-md px-2 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="mt-auto border-t pt-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-medium">Appearance</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
