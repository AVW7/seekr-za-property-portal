import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"

export default async function ListingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listings</h1>
          <p className="text-muted-foreground">
            Manage your property listings and their status.
          </p>
        </div>
        <Button asChild>
          <Link href="/agent/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Listing
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
          <CardDescription>
            A list of all your properties including their status and performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No listings found. Create your first listing to get started.
                  </TableCell>
                </TableRow>
              ) : (
                properties?.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="font-medium">{property.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {property.suburb}, {property.city}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {property.property_type?.replace(/_/g, " ")} ({property.listing_type?.replace(/_/g, " ")})
                    </TableCell>
                    <TableCell>
                      <Badge variant={property.status === "active" ? "default" : "secondary"}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       {formatCurrency(property.price)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {property.views_count || 0} views • {property.enquiries_count || 0} enquiries
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/agent/listings/${property.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                             <Link href={`/properties/${property.id}`} target="_blank">
                              View Live
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Archive Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
