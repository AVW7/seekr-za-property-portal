import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2"
import Calculator from "lucide-react/dist/esm/icons/calculator"
import Zap from "lucide-react/dist/esm/icons/zap"
import Shield from "lucide-react/dist/esm/icons/shield"
import TrendingUp from "lucide-react/dist/esm/icons/trending-up"
import Home from "lucide-react/dist/esm/icons/home"
import Brain from "lucide-react/dist/esm/icons/brain"
import Bell from "lucide-react/dist/esm/icons/bell"
import Map from "lucide-react/dist/esm/icons/map"
import Eye from "lucide-react/dist/esm/icons/eye"
import BarChart3 from "lucide-react/dist/esm/icons/bar-chart-3"
import Sparkles from "lucide-react/dist/esm/icons/sparkles"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 sm:py-20 md:py-28 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center space-y-5 sm:space-y-6">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" />
                AI-Powered Smart Search
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-balance bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Experience the Future of Property Search
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-foreground">
                Find. Explore. Discover.
              </p>
              <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Say goodbye to endless scrolling and irrelevant listings. Seekr brings you a personalized property search 
                experience powered by cutting-edge AI technology.
              </p>

              {/* Search Bar */}
              <div className="mt-8 max-w-3xl mx-auto">
                <SearchBar variant="default" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Seekr?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Revolutionize your property journey with AI-powered features built for South Africa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">AI Smart Search</h3>
                  <p className="text-sm text-muted-foreground">
                    Our intelligent search engine learns from your preferences to deliver the most relevant listings.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <Bell className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">Real-Time Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive instant alerts when new properties match your search criteria and preferences.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Map className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Interactive Maps</h3>
                  <p className="text-sm text-muted-foreground">
                    Draw your desired area directly on the map to focus your search exactly where you want.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">Virtual Tours</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore properties with high-quality media and comprehensive photo galleries.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
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

              <Card className="hover:shadow-lg transition-shadow">
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

              <Card className="hover:shadow-lg transition-shadow">
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

              <Card className="hover:shadow-lg transition-shadow">
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

        {/* How It Works Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12 md:mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to find your perfect property or sell with confidence
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="relative">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-semibold">Create Your Search Persona</h3>
                  <div className="space-y-2 text-sm text-muted-foreground text-left bg-muted/50 rounded-lg p-4">
                    <p><strong>Basic Filters:</strong> Location, price range, property type, and size</p>
                    <p><strong>Intermediate:</strong> Amenities, neighborhood features, property age</p>
                    <p><strong>Advanced:</strong> Energy efficiency, accessibility, legal considerations</p>
                  </div>
                </div>
                {/* Connector Line */}
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -z-10" />
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-accent">2</span>
                  </div>
                  <h3 className="text-xl font-semibold">Let AI Do the Work</h3>
                  <div className="space-y-2 text-sm text-muted-foreground text-left bg-muted/50 rounded-lg p-4">
                    <p><strong>Smart Recommendations:</strong> AI analyzes your persona to suggest properties</p>
                    <p><strong>Real-Time Updates:</strong> Instant notifications for new matches</p>
                    <p><strong>Interactive Maps:</strong> Draw your desired area on the map</p>
                  </div>
                </div>
                {/* Connector Line */}
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-accent/50 to-transparent -z-10" />
              </div>

              {/* Step 3 */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-success">3</span>
                </div>
                <h3 className="text-xl font-semibold">Sell Your Property Effortlessly</h3>
                <div className="space-y-2 text-sm text-muted-foreground text-left bg-muted/50 rounded-lg p-4">
                  <p><strong>Guided Listing:</strong> Easy input with our tiered approach</p>
                  <p><strong>Enhanced Visibility:</strong> AI suggestions to optimize your listing</p>
                  <p><strong>Performance Analytics:</strong> Track views and engagement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Persona Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" />
                Personalized Search
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Personalized Search Personas</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Create customized search profiles with tiered filters—from basic to advanced—to match your exact needs. 
                Save multiple personas for different property goals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-primary">1</span>
                    </div>
                    <h3 className="text-xl font-semibold">Basic Filters</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Location & area preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Price range & budget</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Property type & size</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Bedrooms & bathrooms</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-2 hover:border-accent/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-accent">2</span>
                    </div>
                    <h3 className="text-xl font-semibold">Intermediate</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Amenities (pool, garden, garage)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Neighborhood features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Property age & condition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Security & estate features</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-2 hover:border-success/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-success">3</span>
                    </div>
                    <h3 className="text-xl font-semibold">Advanced</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Energy efficiency (solar, inverter)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Accessibility features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Legal considerations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Pet-friendly & fiber connectivity</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button size="lg" asChild>
                <Link href="/search">
                  Create Your Search Persona
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 space-y-4">
                  <Calculator className="h-10 w-10" />
                  <h3 className="text-2xl font-bold">Calculate Your BuyAbility</h3>
                  <p className="text-primary-foreground/90">
                    Use our comprehensive calculator to see exactly what you can afford. Includes transfer duty, 
                    bond repayments, monthly expenses, and all SA-specific costs.
                  </p>
                  <Button size="lg" variant="secondary" className="mt-4" asChild>
                    <Link href="/calculator">
                      Try Calculator
                      <TrendingUp className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent to-primary text-primary-foreground hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 space-y-4">
                  <BarChart3 className="h-10 w-10" />
                  <h3 className="text-2xl font-bold">List Your Property</h3>
                  <p className="text-primary-foreground/90">
                    Are you an agent or property owner? List your properties with our guided process and reach 
                    verified buyers. Track performance with real-time analytics.
                  </p>
                  <Button size="lg" variant="secondary" className="mt-4" asChild>
                    <Link href="/list-property">
                      Get Started
                      <Home className="ml-2 h-4 w-4" />
                    </Link>
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
