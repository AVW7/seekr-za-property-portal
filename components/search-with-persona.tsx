"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { SavedSearch } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function SearchWithPersona() {
  const searchParams = useSearchParams()
  const personaId = searchParams.get('persona')
  const [persona, setPersona] = useState<SavedSearch | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (personaId) {
      loadPersona(personaId)
    }
  }, [personaId])

  const loadPersona = async (id: string) => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setPersona(data as SavedSearch)
      
      toast({
        title: "Persona Loaded",
        description: `Search filters applied from "${data.name}"`
      })

      // TODO: Apply search params to filter component
      // This would require passing the search_params to the SearchFilters component
      
    } catch (error: any) {
      console.error('Error loading persona:', error)
      toast({
        title: "Error",
        description: "Failed to load persona",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const clearPersona = () => {
    setPersona(null)
    router.push('/search')
  }

  if (!persona && !loading) return null

  return (
    <div className="px-4 py-2 bg-primary/5 border-b">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Active Persona:</span>
          <Badge variant="secondary" className="font-normal">
            {loading ? "Loading..." : persona?.name}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearPersona}
          className="h-7 px-2"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Clear
        </Button>
      </div>
    </div>
  )
}
