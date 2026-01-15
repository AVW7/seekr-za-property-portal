import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export const metadata = {
  title: "Onboard with SeekrZA | Agents",
  description: "Join South Africa's fastest-growing property network.",
}

export default function AgentOnboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Join SeekrZA</h1>
                <p className="text-muted-foreground">Create your agent profile and start listing today.</p>
            </div>

            <div className="border rounded-xl p-6 shadow-sm bg-card space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="agency-name">Agency Name</Label>
                    <Input id="agency-name" placeholder="e.g. Pam Golding, Re/Max..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ffc">FFC Number</Label>
                    <Input id="ffc" placeholder="20251234..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input id="email" type="email" placeholder="agent@agency.co.za" />
                </div>
                <div className="pt-2">
                    <Button className="w-full" size="lg">Continue</Button>
                </div>
                <p className="text-xs text-center text-muted-foreground pt-2">
                    Already have an account? <Link href="/agents/login" className="text-primary underline">Log in</Link>
                </p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
