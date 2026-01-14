import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar } from "lucide-react"
import Link from "next/link"

export function MarketReports() {
  const reports = [
    {
      title: "Q4 2025 Property Market Report",
      description: "Comprehensive analysis of the South African property market",
      date: "December 2025",
      type: "Quarterly",
      featured: true,
    },
    {
      title: "Cape Town Suburb Comparison",
      description: "In-depth comparison of top Cape Town neighborhoods",
      date: "November 2025",
      type: "Regional",
      featured: false,
    },
    {
      title: "Investment Hotspots 2026",
      description: "Best areas for property investment in the coming year",
      date: "January 2026",
      type: "Investment",
      featured: true,
    },
  ]

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Market Reports & Analysis
        </CardTitle>
        <CardDescription>Expert insights and comprehensive market reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reports.map((report) => (
            <Card key={report.title} className={report.featured ? "border-primary/50" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={report.featured ? "default" : "secondary"}>{report.type}</Badge>
                  {report.featured && (
                    <Badge variant="outline" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription className="text-sm">{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="h-3 w-3" />
                  {report.date}
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="#">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
