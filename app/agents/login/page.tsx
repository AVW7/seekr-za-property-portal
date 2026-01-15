import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export const metadata = {
  title: "Agent Login | SeekrZA",
}

export default function AgentLoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-sm mx-auto mb-8 md:mb-0 md:absolute md:top-24 md:left-8">
           <BackButton fallbackUrl="/" />
        </div>
        <div className="max-w-sm mx-auto space-y-8 text-center">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Agent Portal</h1>
                <p className="text-muted-foreground text-sm">Sign in to manage listings and view leads</p>
            </div>

            <div className="space-y-4 text-left">
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-xs text-primary hover:underline">Forgot?</Link>
                    </div>
                    <Input id="password" type="password" />
                </div>
                <Button className="w-full">Sign In</Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
                <Link href="/agents/onboard" className="hover:text-foreground transition-colors">Apply for an agent account</Link>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
