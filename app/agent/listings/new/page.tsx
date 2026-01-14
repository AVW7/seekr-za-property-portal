import { PropertyForm } from "@/components/agent/property-form"

export default function NewListingPage() {
  return (
    <>
      <div className="mb-8">
            <h1 className="text-3xl font-bold">List a New Property</h1>
            <p className="text-muted-foreground">Fill in the details below to publish your listing.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
             <PropertyForm />
          </div>
    </>
  )
}
