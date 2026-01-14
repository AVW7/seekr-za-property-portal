import { createClient } from "@/lib/supabase/server"
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
import { format } from "date-fns"
import { Mail, Phone, MessageSquare } from "lucide-react"

export default async function LeadsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: leads } = await supabase
    .from("leads")
    .select("*, properties(title, suburb)")
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">
          Track and manage inquiries from potential buyers and tenants.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
          <CardDescription>
            A list of all leads received across your listings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No leads yet. They will appear here when customers inquire about your listings.
                  </TableCell>
                </TableRow>
              ) : (
                leads?.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(lead.created_at), "MMM d, yyyy")}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(lead.created_at), "h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {lead.email && (
                            <a href={`mailto:${lead.email}`} className="hover:underline flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {lead.email}
                            </a>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="hover:underline flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {lead.phone}
                            </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.properties ? (
                         <>
                            <div className="font-medium line-clamp-1">{(lead.properties as any).title}</div>
                            <div className="text-sm text-muted-foreground">{(lead.properties as any).suburb}</div>
                         </>
                      ) : (
                        <span className="text-muted-foreground italic">Property removed</span>
                      )}
                    </TableCell>
                    <TableCell>
                         <div className="w-[300px] text-sm">
                            {lead.message}
                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs font-normal">
                                    {lead.channel}
                                </Badge>
                            </div>
                         </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={lead.status === "new" ? "default" : "secondary"}>
                        {lead.status}
                      </Badge>
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
