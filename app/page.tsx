import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, CheckCircle2, Calculator, Zap, Shield, TrendingUp, Home } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 sm:py-20 md:py-28 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center space-y-5 sm:space-y-6">
              <Badge variant="secondary" className="mb-4">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified Listings Only
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-balance">Find Your Perfect South African Property</h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty">
                Transparent pricing, verified listings, and SA-specific affordability tools to help you make informed
                decisions.
              </p>

              {/* Search Bar */}
              <div className="mt-8">
                <form className="flex gap-2 max-w-2xl mx-auto">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search by suburb, city, or area..." className="pl-10 h-12" />
                  </div>
                  <Button size="lg" asChild>
                    <Link href="/properties">
                      <Search className="mr-2 h-5 w-5" />
                      Search
                    </Link>
                  </Button>
                </form>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/properties?city=cape-town">Cape Town</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/properties?city=johannesburg">Johannesburg</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/properties?city=pretoria">Pretoria</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/properties?city=durban">Durban</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12 md:mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SeekrZA?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for South Africa, with the features that matter most to SA property seekers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              <Card>
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Verified Listings</h3>
                  <p className="text-sm text-muted-foreground">
                    Every property is verified with clear verification badges and transparent ownership details.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <Calculator className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">BuyAbility Calculator</h3>
                  <p className="text-sm text-muted-foreground">
                    Know exactly what you can afford with our SA-specific calculator including transfer duty and levies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="font-semibold text-lg">Load-Shedding Ready</h3>
                  <p className="text-sm text-muted-foreground">
                    Filter by solar, inverter, and backup power. See which homes keep the lights on.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Transparent Costs</h3>
                  <p className="text-sm text-muted-foreground">
                    See all costs upfront: levies, rates, transfer duty, and conveyancing fees.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <CardContent className="pt-6 space-y-4">
                  <TrendingUp className="h-10 w-10" />
                  <h3 className="text-2xl font-bold">Calculate Affordability</h3>
                  <p className="text-primary-foreground/90">
                    Use our BuyAbility calculator to see exactly what you can afford, including transfer costs, bond
                    repayments, and monthly expenses.
                  </p>
                  <Button size="lg" variant="secondary" className="mt-4" asChild>
                    <Link href="/calculator">Try Calculator</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent to-primary text-primary-foreground">
                <CardContent className="pt-6 space-y-4">
                  <Home className="h-10 w-10" />
                  <h3 className="text-2xl font-bold">List Your Property</h3>
                  <p className="text-primary-foreground/90">
                    Are you an agent or property owner? List your properties and reach verified buyers across South
                    Africa.
                  </p>
                  <Button size="lg" variant="secondary" className="mt-4" asChild>
                    <Link href="/auth/sign-up">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
