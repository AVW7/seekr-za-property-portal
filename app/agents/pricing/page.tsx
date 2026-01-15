import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export const metadata = {
  title: "Agent Pricing | SeekrZA",
  description: "Simple, transparent pricing for agencies of all sizes.",
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">No long-term contracts. Cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="border rounded-2xl p-8 flex flex-col items-center text-center space-y-6">
                <h3 className="font-semibold text-lg">Starter Agent</h3>
                <div className="space-y-1">
                    <span className="text-4xl font-bold">R499</span>
                    <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground pb-4 border-b w-full">Perfect for independent agents starting out.</p>
                <ul className="space-y-3 text-sm text-left w-full">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Up to 20 Listings</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Basic Lead Verification</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Web Dashboard</li>
                </ul>
                <Button variant="outline" className="w-full mt-auto">Get Started</Button>
            </div>

            {/* Pro - Highlighted */}
            <div className="border-2 border-primary rounded-2xl p-8 flex flex-col items-center text-center space-y-6 relative shadow-lg">
                <div className="absolute -top-3 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-semibold">MOST POPULAR</div>
                <h3 className="font-semibold text-lg">Pro Agency</h3>
                <div className="space-y-1">
                    <span className="text-4xl font-bold">R1 999</span>
                    <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground pb-4 border-b w-full">For growing teams wanting max exposure.</p>
                <ul className="space-y-3 text-sm text-left w-full">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Unlimited Listings</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Featured Lisitng Boosts (3/mo)</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> XML Feed Sync</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Team Management</li>
                </ul>
                <Button className="w-full mt-auto">Go Pro</Button>
            </div>

            {/* Enterprise */}
            <div className="border rounded-2xl p-8 flex flex-col items-center text-center space-y-6">
                <h3 className="font-semibold text-lg">Enterprise</h3>
                <div className="space-y-1">
                    <span className="text-4xl font-bold">Custom</span>
                </div>
                <p className="text-sm text-muted-foreground pb-4 border-b w-full">For national franchises.</p>
                <ul className="space-y-3 text-sm text-left w-full">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> API Access</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Dedicated Account Manager</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Custom Reporting</li>
                </ul>
                <Button variant="outline" className="w-full mt-auto">Contact Sales</Button>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
