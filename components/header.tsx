"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Menu from "lucide-react/dist/esm/icons/menu";
import Heart from "lucide-react/dist/esm/icons/heart";
import Bell from "lucide-react/dist/esm/icons/bell";
import Settings from "lucide-react/dist/esm/icons/settings";
import LogOut from "lucide-react/dist/esm/icons/log-out";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import User from "lucide-react/dist/esm/icons/user";
import Search from "lucide-react/dist/esm/icons/search";
import Home from "lucide-react/dist/esm/icons/home";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import BarChart3 from "lucide-react/dist/esm/icons/bar-chart-3";
import Calculator from "lucide-react/dist/esm/icons/calculator";
import Briefcase from "lucide-react/dist/esm/icons/briefcase";
import LogIn from "lucide-react/dist/esm/icons/log-in";
import UserPlus from "lucide-react/dist/esm/icons/user-plus";
import LayoutDashboard from "lucide-react/dist/esm/icons/layout-dashboard";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isAgent, setIsAgent] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const checkAgentStatus = async () => {
      if (!user) {
        setIsAgent(false);
        return;
      }
      
      const supabase = createClient();
      const { data: agent } = await supabase
        .from("agents")
        .select("id")
        .eq("id", user.id)
        .single();
      
      setIsAgent(!!agent);
    };
    
    checkAgentStatus();
  }, [user]);

  return (
    <>
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
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
                      alt={user.user_metadata?.full_name || user.email || 'User'}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
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
                {isAgent ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/agent">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Agent Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account">
                        <User className="mr-2 h-4 w-4" />
                        Account Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
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
            <SheetContent side="right" className="w-[320px] sm:w-[400px] flex flex-col p-0 gap-0">
              <SheetHeader className="p-6 border-b text-left bg-muted/10">
                <SheetTitle className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-primary">SeekrZA</span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-6 p-6">
                  {/* User Section */}
                  {user ? (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border shadow-sm">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={user.email || "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.email?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-semibold truncate text-sm">{user.email}</span>
                        <Link href="/account" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1" onClick={() => setIsOpen(false)}>
                          View Dashboard <ChevronDown className="h-3 w-3 -rotate-90" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" asChild onClick={() => setIsOpen(false)} className="w-full justify-center h-11">
                        <Link href="/auth/login">
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign in
                        </Link>
                      </Button>
                      <Button asChild onClick={() => setIsOpen(false)} className="w-full justify-center h-11 shadow-sm">
                        <Link href="/auth/sign-up">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Sign up
                        </Link>
                      </Button>
                    </div>
                  )}

                  {/* Navigation Accordion */}
                  <Accordion type="single" collapsible className="w-full" defaultValue="Browse">
                    {navConfig.mobile.sheetMenu.sections.map((section) => (
                      <AccordionItem key={section.title} value={section.title} className="border-b-0 mb-2">
                        <AccordionTrigger className="text-base font-semibold py-3 px-2 hover:bg-muted/50 rounded-lg hover:no-underline transition-all [&[data-state=open]]:bg-muted/50">
                          <span className="flex items-center gap-3">
                            <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                                {section.title === "Browse" && <Search className="h-4 w-4" />}
                                {section.title === "Tools" && <Calculator className="h-4 w-4" />}
                                {section.title === "Agents" && <Briefcase className="h-4 w-4" />}
                            </span>
                            {section.title}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="flex flex-col space-y-1 pl-11 pt-1 border-l-2 ml-5 border-muted my-1">
                            {section.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 px-2 text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all rounded-r-md"
                                onClick={() => setIsOpen(false)}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  {user && (
                    <div className="flex flex-col space-y-1 border-t pt-6 mt-2">
                        <Link 
                            href="/account/settings" 
                            className="flex items-center gap-3 py-3 px-3 rounded-lg text-sm font-medium hover:bg-muted/50 transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            Settings
                        </Link>
                        <button 
                            className="flex items-center gap-3 py-3 px-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all text-left w-full"
                            onClick={() => {
                                signOut();
                                setIsOpen(false);
                            }}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-muted/10 border-t mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    System Operational
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2">Mode</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
