import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Home,
  Search,
  Calculator,
  Users,
  HelpCircle,
  FileText,
  Shield,
  Heart
} from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">SeekrZA</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Find your perfect South African property with verified listings,
              transparent pricing, and AI-powered smart search.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Stay Updated</h4>
              <p className="text-xs text-muted-foreground">
                Get the latest property listings and market insights
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="text-sm h-9"
                />
                <Button size="sm" className="h-9 px-4">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Property Search */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Property Search
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/search?intent=buy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Buy Properties
                </Link>
              </li>
              <li>
                <Link href="/search?intent=rent" className="text-muted-foreground hover:text-foreground transition-colors">
                  Rent Properties
                </Link>
              </li>
              <li>
                <Link href="/buyability" className="text-muted-foreground hover:text-foreground transition-colors">
                  BuyAbility Calculator
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="text-muted-foreground hover:text-foreground transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/saved" className="text-muted-foreground hover:text-foreground transition-colors">
                  Saved Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Locations */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Popular Locations
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/suburbs/western-cape/cape-town" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cape Town
                </Link>
              </li>
              <li>
                <Link href="/suburbs/gauteng/johannesburg" className="text-muted-foreground hover:text-foreground transition-colors">
                  Johannesburg
                </Link>
              </li>
              <li>
                <Link href="/suburbs/gauteng/sandton" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sandton
                </Link>
              </li>
              <li>
                <Link href="/suburbs/kzn/durban" className="text-muted-foreground hover:text-foreground transition-colors">
                  Durban
                </Link>
              </li>
              <li>
                <Link href="/suburbs/gauteng/pretoria" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pretoria
                </Link>
              </li>
            </ul>
          </div>

          {/* For Agents & Sellers */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              For Agents & Agencies
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/agents" className="text-muted-foreground hover:text-foreground transition-colors">
                  Seekr for Agents
                </Link>
              </li>
              <li>
                <Link href="/agents/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/agent" className="text-muted-foreground hover:text-foreground transition-colors">
                  Agent Dashboard
                </Link>
              </li>
              <li>
                <Link href="/agents/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Agent Login
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-muted-foreground hover:text-foreground transition-colors">
                  Market Insights
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Secondary Footer Content */}
        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Support & Help */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Support & Help</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <HelpCircle className="h-3 w-3" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Connect With Us</h4>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>+27 21 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>hello@seekrza.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>Cape Town, South Africa</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <p>© 2026 SeekrZA. All rights reserved.</p>
              <span className="hidden sm:inline">•</span>
              <p>Made with <Heart className="h-3 w-3 inline text-red-500 fill-red-500" /> in South Africa</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Link href="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                Sitemap
              </Link>
              <Link href="/accessibility" className="text-muted-foreground hover:text-foreground transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
