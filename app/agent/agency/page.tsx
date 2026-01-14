import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default async function AgencyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch agent with agency details
  const { data: agent } = await supabase
    .from("agents")
    .select("*, agencies(*)")
    .eq("id", user.id)
    .single()

  const agency = agent?.agencies

  if (!agency) {
      return (
          <div className="space-y-6">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">Agency Profile</h1>
                  <p className="text-muted-foreground">
                      Manage your agency details and branding.
                  </p>
              </div>
              <Card>
                  <CardContent className="py-10 text-center">
                      <p className="text-muted-foreground mb-4">You are not linked to any agency yet.</p>
                      <Button>Join or Create Agency</Button>
                  </CardContent>
              </Card>
          </div>
      )
  }

  // Cast for typescript happiness in template if needed, or just let it infer
  const agencyData = agency as any // Simplify access

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agency Profile</h1>
        <p className="text-muted-foreground">
          View your agency details. Contact support to update these details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agency Details</CardTitle>
          <CardDescription>
            Information about the real estate agency you represent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                <Label>Agency Name</Label>
                <div className="p-3 bg-muted rounded-md">{agencyData.name}</div>
            </div>
             <div className="space-y-2">
                <Label>Brand Name</Label>
                <div className="p-3 bg-muted rounded-md">{agencyData.brand_name || "N/A"}</div>
            </div>
             <div className="space-y-2">
                <Label>Office Name</Label>
                <div className="p-3 bg-muted rounded-md">{agencyData.office_name || "N/A"}</div>
            </div>
             <div className="space-y-2">
                <Label>BBEE Level</Label>
                <div className="p-3 bg-muted rounded-md">{agencyData.bbee_level || "Not specified"}</div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
             <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="p-3 bg-muted rounded-md">{agencyData.email || "N/A"}</div>
            </div>
             <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="p-3 bg-muted rounded-md">{agencyData.phone || "N/A"}</div>
            </div>
             <div className="space-y-2">
                <Label>Website</Label>
                 <div className="p-3 bg-muted rounded-md">{agencyData.website_url || "N/A"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
