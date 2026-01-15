import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Bell, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Property Alets | SeekrZA",
  description: "Manage your email and push notifications for new properties.",
}

export default function AlertsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
         <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-accent/20 rounded-full">
                <Bell className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
                <h1 className="text-2xl font-bold">Property Alerts</h1>
                <p className="text-muted-foreground">Get notified when new homes match your criteria.</p>
            </div>
         </div>

         <div className="space-y-6">
            <div className="border rounded-lg p-12 text-center space-y-4 bg-muted/20">
                <div className="mx-auto w-12 h-12 rounded-full bg-background border flex items-center justify-center shadow-sm">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg">No active alerts</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    You haven't set up any alerts yet. Search for a location and click "Set Alert" to get started.
                </p>
                <Button asChild>
                    <a href="/search">Start Searching</a>
                </Button>
            </div>

            <div className="border rounded-lg p-6 flex items-start gap-4">
                <Settings2 className="h-5 w-5 mt-1 text-muted-foreground" />
                <div className="flex-1">
                    <h3 className="font-medium">Notification Settings</h3>
                    <p className="text-sm text-muted-foreground mb-4">Choose how you want to be notified.</p>
                    
                    <div className="space-y-3">
                        <label className="flex items-center gap-2">
                             <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                             <span className="text-sm">Instant Email Alerts</span>
                        </label>
                        <label className="flex items-center gap-2">
                             <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                             <span className="text-sm">Weekly Market Digest</span>
                        </label>
                    </div>
                </div>
            </div>
         </div>
      </main>
      <Footer />
    </div>
  )
}
