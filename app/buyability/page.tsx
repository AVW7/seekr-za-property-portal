import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BuyAbilityInline } from "@/components/buy-ability-inline"

export const metadata = {
  title: "BuyAbility Calculator | SeekrZA",
  description: "Calculate your true property affordability including transfer costs, bond registration, and monthly levies.",
}

export default function BuyAbilityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="space-y-6 text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold">Know Your True Buying Power</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Most calculators only check your salary. The SeekrZA BuyAbility™ score includes transfer duties, bond registration costs, rates, and levies to give you a realistic budget.
            </p>
          </div>
          
          <div className="bg-background border rounded-xl shadow-sm overflow-hidden">
             <div className="p-6 md:p-8">
               <BuyAbilityInline />
             </div>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3 text-center">
            <div className="space-y-2">
               <div className="text-4xl font-bold text-primary">100%</div>
               <h3 className="font-semibold">Accurate Costs</h3>
               <p className="text-sm text-muted-foreground">Includes transfer duty brackets (2025/2026)</p>
            </div>
            <div className="space-y-2">
               <div className="text-4xl font-bold text-primary">0</div>
               <h3 className="font-semibold">Hidden Fees</h3>
               <p className="text-sm text-muted-foreground">We calculate attorney & deed office fees</p>
            </div>
            <div className="space-y-2">
               <div className="text-4xl font-bold text-primary">24/7</div>
               <h3 className="font-semibold">Pre-Approval</h3>
               <p className="text-sm text-muted-foreground">Get a certificate to show agents you're serious</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
