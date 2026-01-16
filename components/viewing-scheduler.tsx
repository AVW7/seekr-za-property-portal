"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Video } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface ViewingSchedulerProps {
  propertyId: string
  propertyTitle: string
  agentId: string
}

export function ViewingScheduler({
  propertyId,
  propertyTitle,
  agentId,
}: ViewingSchedulerProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isVirtual, setIsVirtual] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !time || !name || !email || !phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("viewing_requests").insert({
        property_id: propertyId,
        agent_id: agentId,
        name,
        email,
        phone,
        preferred_date: date.toISOString(),
        preferred_time: time,
        notes,
        is_virtual: isVirtual,
        status: "pending",
      })

      if (error) throw error

      toast({
        title: "Viewing Requested!",
        description: "The agent will contact you to confirm the viewing",
      })

      // Reset form
      setDate(undefined)
      setTime("")
      setName("")
      setEmail("")
      setPhone("")
      setNotes("")
      setIsVirtual(false)
    } catch (error: any) {
      console.error("Error submitting viewing request:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to schedule viewing",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Schedule a Viewing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Preferred Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="viewing-name">Name</Label>
            <Input
              id="viewing-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="viewing-email">Email</Label>
            <Input
              id="viewing-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="viewing-phone">Phone</Label>
            <Input
              id="viewing-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any specific requirements or questions..."
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsVirtual(!isVirtual)}
          >
            <Video className="mr-2 h-4 w-4" />
            {isVirtual ? "In-Person Viewing" : "Request Virtual Tour"}
          </Button>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Request Viewing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
