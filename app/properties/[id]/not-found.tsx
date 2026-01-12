import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function PropertyNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">Property Not Found</h1>
          <p className="text-muted-foreground text-lg">
            The property you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/properties">
              <Search className="mr-2 h-5 w-5" />
              Browse Properties
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
