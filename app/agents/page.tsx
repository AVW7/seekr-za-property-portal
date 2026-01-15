import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "For Agents | SeekrZA",
  description: "Tools for estate agents to list properties, manage leads, and grow their agency brand.",
}

export default function AgentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20">
            <div className="container mx-auto px-4 text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Sell Smarter, Not Harder</h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                    The modern property portal built for the digital-first agent. AI leads, automated valuations, and 0% commission on self-generated deals.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100" asChild>
                        <Link href="/agents/onboard">Start Your Free Trial</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-slate-800" asChild>
                        <Link href="/agents/login">Agent Login</Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-20">
            <div className="grid md:grid-cols-3 gap-10">
                <div className="space-y-4">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold">Verified Leads</h3>
                    <p className="text-muted-foreground">No more "is this available" spam. We verify every lead's phone number and intent before it reaches you.</p>
                </div>
                <div className="space-y-4">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold">Instant CRM Sync</h3>
                    <p className="text-muted-foreground">Seamlessly integrates with Prophet, Vault, Property24, and other major listing management systems.</p>
                </div>
                <div className="space-y-4">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold">Automated Marketing</h3>
                    <p className="text-muted-foreground">We automatically generate social media assets and email campaigns for your new listings.</p>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
