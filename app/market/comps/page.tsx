import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LayoutList } from "lucide-react"

export const metadata = {
  title: "Property Comparables | SeekrZA",
  description: "Generate comparative market analysis (CMA) reports for properties.",
}

export default function ComparablePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <LayoutList className="h-8 w-8 text-accent-foreground" />
            </div>
            
            <h1 className="text-3xl font-bold">Comparative Market Analysis</h1>
            <p className="text-xl text-muted-foreground">
                See how specific properties stack up against similar listings in the area.
            </p>

            <div className="p-8 border-2 border-dashed rounded-xl bg-muted/30 mt-8">
                <p className="font-medium text-lg">Compare Tool Loading...</p>
                <p className="text-muted-foreground">Select a property from the search page to view comps.</p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
