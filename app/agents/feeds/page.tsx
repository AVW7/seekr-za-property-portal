import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Code2, Database } from "lucide-react"

export const metadata = {
  title: "XML Feed Specifications | SeekrZA",
  description: "Technical documentation for syncing property listings via XML feeds.",
}

export default function FeedSpecsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Feed Specifications</h1>
                <p className="text-lg text-muted-foreground">
                    Connect your existing listing management system (PRO Systems, PropCtrl, etc.) directly to SeekrZA.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 border rounded-lg">
                    <Database className="h-8 w-8 mb-4 text-secondary-foreground" />
                    <h3 className="font-bold text-lg mb-2">Supported Formats</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>P24 Schema (v1.2+)</li>
                        <li>OpenRealEstate XML</li>
                        <li>PrivateProperty Feed Format</li>
                    </ul>
                </div>
                <div className="p-6 border rounded-lg">
                    <Code2 className="h-8 w-8 mb-4 text-secondary-foreground" />
                    <h3 className="font-bold text-lg mb-2">FTP Details</h3>
                    <p className="text-sm text-muted-foreground">
                        Secure FTP access is provisioned upon account approval. Documentation is available in the agent dashboard.
                    </p>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
