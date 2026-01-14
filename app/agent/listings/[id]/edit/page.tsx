import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PropertyForm } from "@/components/agent/property-form"

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch property details ensuring it belongs to the agent
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", params.id)
    .eq("agent_id", user.id)
    .single()

  if (error || !property) {
    redirect("/agent")
  }

  return (
    <>
      <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Listing</h1>
            <p className="text-muted-foreground">Update the details of your property.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
             <PropertyForm initialData={property} propertyId={property.id} />
          </div>
    </>
  )
}
