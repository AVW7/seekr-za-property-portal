import Link from "next/link"
import { Building2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-bold">SeekrZA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Find your perfect South African property with verified listings and transparent pricing.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/properties?type=house">Houses</Link>
              </li>
              <li>
                <Link href="/properties?type=apartment">Apartments</Link>
              </li>
              <li>
                <Link href="/properties?type=townhouse">Townhouses</Link>
              </li>
              <li>
                <Link href="/properties?type=plot">Land & Plots</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Popular Locations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/suburbs/cape-town">Cape Town</Link>
              </li>
              <li>
                <Link href="/suburbs/johannesburg">Johannesburg</Link>
              </li>
              <li>
                <Link href="/suburbs/pretoria">Pretoria</Link>
              </li>
              <li>
                <Link href="/suburbs/durban">Durban</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Agents</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/auth/sign-up">Register as Agent</Link>
              </li>
              <li>
                <Link href="/agent">Agent Dashboard</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 SeekrZA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
