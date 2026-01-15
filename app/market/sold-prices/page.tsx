import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export const metadata = {
  title: "Sold Property Prices | SeekrZA",
  description: "Search recent property sales registration data from the Deeds Office.",
}

export default function SoldPricesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8 text-center">
          <h1 className="text-3xl font-bold">Sold Property Prices</h1>
          <p className="text-muted-foreground text-lg">
            See what homes actually sold for in your neighborhood. Powered by verified Deeds Office data.
          </p>

          <div className="relative">
             <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
             <Input 
                className="pl-10 h-12 text-lg" 
                placeholder="Enter a suburb, street, or complex..." 
             />
             <Button className="absolute right-1 top-1 bottom-1">Search</Button>
          </div>

          <div className="text-left bg-muted/50 p-6 rounded-lg border mt-8">
            <h3 className="font-semibold mb-4">Why check sold prices?</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Make a competitive offer based on real data</li>
                <li>Avoid overpaying in a cooling market</li>
                <li>Understand the difference between asking price and selling price</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
