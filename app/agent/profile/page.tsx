import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!agent) return <div>Agent profile not found</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Your public agent profile details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              This information is displayed on your listings and public profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                    {agent.profile_image_url ? (
                        <img src={agent.profile_image_url} alt={agent.full_name} className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-2xl text-muted-foreground font-semibold">
                            {agent.full_name?.charAt(0) || "A"}
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-medium">{agent.full_name}</h3>
                    <div className="flex gap-2 mt-1">
                        {agent.verified && <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Verified Agent</Badge>}
                        <Badge variant="outline">{agent.eaab_ppra_ffc_number || "No FFC Number"}</Badge>
                    </div>
                </div>
             </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="p-3 bg-muted rounded-md">{agent.full_name}</div>
              </div>
              <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="p-3 bg-muted rounded-md">{agent.email}</div>
              </div>
              <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="p-3 bg-muted rounded-md">{agent.phone || "Not provided"}</div>
              </div>
              <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <div className="p-3 bg-muted rounded-md">{agent.whatsapp_number || "Not provided"}</div>
              </div>
            </div>

            <div className="space-y-2">
                <Label>Bio</Label>
                <div className="p-3 bg-muted rounded-md min-h-[100px] whitespace-pre-wrap">
                    {agent.bio || "No bio provided."}
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Specializations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="mb-2 block">Focus Areas</Label>
                    <div className="flex flex-wrap gap-2">
                        {agent.focus_areas && agent.focus_areas.length > 0 ? (
                            agent.focus_areas.map((area: string) => (
                                <Badge key={area} variant="outline">{area}</Badge>
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground">No focus areas specified</span>
                        )}
                    </div>
                </div>
                <div>
                    <Label className="mb-2 block">Property Types</Label>
                    <div className="flex flex-wrap gap-2">
                        {agent.focus_property_types && agent.focus_property_types.length > 0 ? (
                            agent.focus_property_types.map((type: string) => (
                                <Badge key={type} variant="outline">{type.replace(/_/g, ' ')}</Badge>
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground">No property types specified</span>
                        )}
                    </div>
                </div>
                <div className="flex gap-4 pt-2">
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${agent.handles_sales ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm">Sales</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${agent.handles_rentals ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm">Rentals</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
