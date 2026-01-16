'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Home, Heart, Search, TrendingUp, Settings, Menu, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  { href: '/account', label: 'Dashboard', icon: Home },
  { href: '/account/for-you', label: 'For You', icon: Sparkles },
  { href: '/saved', label: 'Saved', icon: Heart },
  { href: '/account/personas', label: 'Personas', icon: Search },
  { href: '/account/buyability', label: 'BuyAbility', icon: TrendingUp },
  { href: '/account/settings', label: 'Settings', icon: Settings },
]

export function AccountNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Desktop Navigation */}
      <nav aria-label="Account navigation" className="hidden md:flex items-center gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={active ? 'default' : 'ghost'}
                size="sm"
                className={cn(active && 'font-medium')}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="sm">
            <Menu className="h-4 w-4 mr-2" aria-hidden="true" />
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <SheetHeader>
            <SheetTitle>Account Menu</SheetTitle>
          </SheetHeader>
          <nav aria-label="Account navigation" className="flex flex-col gap-2 mt-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={active ? 'default' : 'ghost'}
                    size="sm"
                    className={cn('w-full justify-start', active && 'font-medium')}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
