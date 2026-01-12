import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import type { Agent } from "@/lib/types"
import Image from "next/image"

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <Image
              src={agent.profile_image_url || "/placeholder.svg"}
              alt={agent.company_name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{agent.company_name}</h3>
              {agent.verified && (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            {agent.bio && <p className="text-sm text-muted-foreground line-clamp-3">{agent.bio}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
