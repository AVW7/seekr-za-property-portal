import { redirect } from "next/navigation"
import { serverClient } from "@/utils/server-trpc"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, MessageSquare, Eye, Plus } from "lucide-react"
import Link from "next/link"

export default async function AgentDashboardPage() {
  const api = await serverClient()

  let dashboardData
  try {
    dashboardData = await api.agent.getDashboardStats()
  } catch (error) {
    redirect("/auth/login")
  }

  const { user, properties, leads, stats } = dashboardData
  const { totalViews, activeListingsCount, newLeadsCount } = stats

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agent Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.email}</p>
            </div>
            <Button size="lg" asChild>
              <Link href="/agent/listings/new">
                <Plus className="mr-2 h-5 w-5" />
                List Property
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeListingsCount}</div>
                <p className="text-xs text-muted-foreground">{properties?.length || 0} total listings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leads?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {newLeadsCount} new inquiries
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews}</div>
                <p className="text-xs text-muted-foreground">Across all listings</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
              </CardHeader>
              <CardContent>
                {leads && leads.length > 0 ? (
                  <div className="space-y-4">
                    {leads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="flex justify-between items-start border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.email || lead.phone}</p>
                          {lead.properties && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Re: {(lead.properties as any).title}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                           <Link href={`/agent/leads/${lead.id}`}>Contact</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No leads yet. Your inquiries will appear here.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Listings</CardTitle>
              </CardHeader>
              <CardContent>
                {properties && properties.length > 0 ? (
                  <div className="space-y-4">
                    {properties.slice(0, 5).map((property) => (
                      <div key={property.id} className="flex justify-between items-start border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium line-clamp-1">{property.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {property.suburb}, {property.city}
                          </p>
                          <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                            <span>{property.views_count || 0} views</span>
                            <span>•</span>
                            <span>{property.enquiries_count || 0} enquiries</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/agent/listings/${property.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-4">You haven't listed any properties yet.</p>
                    <Button asChild>
                      <Link href="/agent/listings/new">Create First Listing</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
    </>
  )
}
