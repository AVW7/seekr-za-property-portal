import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

export const metadata = {
  title: "Property Market Trends | SeekrZA",
  description: "Visual property market trends, price growth, and suburb performance data.",
}

export default function MarketTrendsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-primary/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
             </div>
             <div>
                <h1 className="text-3xl font-bold">Market Trends</h1>
                <p className="text-muted-foreground">National and provincial property performance indicators</p>
             </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {/* Simple visual placeholders for charts */}
             <div className="border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">National House Price Inflation</h3>
                <div className="h-40 bg-muted/30 rounded-md flex items-end justify-between p-4 gap-2">
                    {[30, 45, 40, 55, 60, 58, 65].map((h, i) => (
                        <div key={i} className="bg-primary w-full rounded-t-sm" style={{ height: `${h}%` }}></div>
                    ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold">2.4%</span>
                    <span className="text-green-600 flex items-center text-sm"><ArrowUpRight className="h-4 w-4 mr-1"/> YOY</span>
                </div>
             </div>

             <div className="border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Interest Rate Cycle</h3>
                 <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Interactive Chart Component</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold">11.75%</span>
                    <span className="text-muted-foreground text-sm">Prime Rate</span>
                </div>
             </div>

             <div className="border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Rental Yield</h3>
                <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Yield Map Component</span>
                </div>
                 <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold">8.1%</span>
                    <span className="text-green-600 flex items-center text-sm">Western Cape</span>
                </div>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
