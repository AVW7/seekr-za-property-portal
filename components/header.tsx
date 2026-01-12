"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Building2, Heart, User, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-lg sm:text-xl font-bold">SeekrZA</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/properties"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Buy
            </Link>
            <Link
              href="/properties?type=rent"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Rent
            </Link>
            <Link
              href="/suburbs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Suburbs
            </Link>
            <Link
              href="/calculator"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Affordability
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
            <Link href="/saved">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button className="hidden sm:flex" asChild>
            <Link href="/list-property">List Property</Link>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/properties"
                  className="text-lg font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Buy Properties
                </Link>
                <Link
                  href="/properties?type=rent"
                  className="text-lg font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Rent Properties
                </Link>
                <Link
                  href="/suburbs"
                  className="text-lg font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Browse Suburbs
                </Link>
                <Link
                  href="/calculator"
                  className="text-lg font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Affordability Calculator
                </Link>
                <div className="border-t pt-4 mt-4 space-y-3">
                  <Link href="/saved" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                      <Heart className="mr-2 h-5 w-5" />
                      Saved Properties
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                      <User className="mr-2 h-5 w-5" />
                      Agent Login
                    </Button>
                  </Link>
                  <Link href="/list-property" onClick={() => setIsOpen(false)}>
                    <Button className="w-full" size="lg">
                      List Your Property
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
