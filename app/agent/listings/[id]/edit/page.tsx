import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PropertyForm } from "@/components/agent/property-form"
import { Button } from "@/components/ui/button"
import type { Database } from "@/lib/database.types"

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"]

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()

  const { id } = await params

  const userPromise = supabase.auth.getUser()
  const propertyPromise = supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single()

  const [
    {
      data: { user },
    },
    { data: property, error },
  ] = await Promise.all([userPromise, propertyPromise])

  if (!user) {
    redirect("/auth/login")
  }

  if (error || !property) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">Unable to load listing</h1>
        <p className="text-muted-foreground">
          {error?.message || "Listing not found or you don’t have access."}
        </p>
        <Button asChild variant="outline">
          <Link href="/agent/listings">Back to listings</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Listing</h1>
            <p className="text-muted-foreground">Update the details of your property.</p>
          </div>
          
           <div className="max-w-4xl mx-auto">
             <PropertyForm initialData={property as PropertyRow} propertyId={property.id} />
          </div>
    </>
  )
}
