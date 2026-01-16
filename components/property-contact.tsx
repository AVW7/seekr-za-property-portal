"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Phone, Mail } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { Property, Agent } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface PropertyContactProps {
  property: Property
  agent: Agent | null
}

export function PropertyContact({ property, agent }: PropertyContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in ${property.title}. Please contact me with more information.`,
    consent: false,
  })
  const { toast } = useToast()

  const handleWhatsApp = () => {
    if (agent?.whatsapp_number) {
      const message = encodeURIComponent(
        `Hi, I'm interested in the property: ${property.title} (${property.suburb}). Price: R${property.price.toLocaleString()}`,
      )
      window.open(`https://wa.me/${agent.whatsapp_number}?text=${message}`, "_blank")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please agree to the privacy policy to continue",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("leads").insert({
        property_id: property.id,
        agent_id: property.agent_id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        lead_type: "inquiry",
        status: "new",
      })

      if (error) throw error

      toast({
        title: "Inquiry Sent!",
        description: "The agent will contact you shortly.",
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: `Hi, I'm interested in ${property.title}. Please contact me with more information.`,
        consent: false,
      })
    } catch (error) {
      console.error("[v0] Error submitting inquiry:", error)
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* WhatsApp CTA - Prominent for SA market */}
        {agent?.whatsapp_number && (
          <Button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white" size="lg">
            <MessageSquare className="mr-2 h-5 w-5" />
            WhatsApp Agent
          </Button>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          <div className="flex items-start gap-2 pt-2">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, consent: checked === true })
              }
            />
            <label htmlFor="consent" className="text-xs text-muted-foreground cursor-pointer leading-tight">
              I agree to SeekrZA's{" "}
              <a href="/privacy" className="underline hover:text-foreground" target="_blank">
                Privacy Policy
              </a>{" "}
              and consent to my information being processed in accordance with POPIA for the
              purpose of this property inquiry.
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting || !formData.consent}>
            <Mail className="mr-2 h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>

        {agent?.phone && (
          <div className="pt-4 border-t text-center">
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href={`tel:${agent.phone}`}>
                <Phone className="mr-2 h-4 w-4" />
                Call {agent.phone}
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
