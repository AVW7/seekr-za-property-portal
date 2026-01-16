export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      affordability_profiles: {
        Row: {
          created_at: string | null
          deposit_amount: number
          id: string
          interest_rate: number
          loan_term_years: number
          max_affordable_price: number | null
          max_monthly_payment: number | null
          monthly_expenses: number
          monthly_income: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deposit_amount: number
          id?: string
          interest_rate: number
          loan_term_years: number
          max_affordable_price?: number | null
          max_monthly_payment?: number | null
          monthly_expenses: number
          monthly_income: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          deposit_amount?: number
          id?: string
          interest_rate?: number
          loan_term_years?: number
          max_affordable_price?: number | null
          max_monthly_payment?: number | null
          monthly_expenses?: number
          monthly_income?: number
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      agencies: {
        Row: {
          address: Json | null
          bbee_level: string | null
          brand_name: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          office_name: string | null
          phone: string | null
          portal_profile_url: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: Json | null
          bbee_level?: string | null
          brand_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          office_name?: string | null
          phone?: string | null
          portal_profile_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: Json | null
          bbee_level?: string | null
          brand_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          office_name?: string | null
          phone?: string | null
          portal_profile_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          agency_id: string | null
          bio: string | null
          created_at: string | null
          eaab_ppra_ffc_number: string | null
          email: string | null
          focus_areas: string[] | null
          focus_property_types: string[] | null
          full_name: string
          handles_rentals: boolean | null
          handles_sales: boolean | null
          id: string
          phone: string | null
          profile_image_url: string | null
          updated_at: string | null
          verified: boolean | null
          whatsapp_number: string | null
        }
        Insert: {
          agency_id?: string | null
          bio?: string | null
          created_at?: string | null
          eaab_ppra_ffc_number?: string | null
          email?: string | null
          focus_areas?: string[] | null
          focus_property_types?: string[] | null
          full_name: string
          handles_rentals?: boolean | null
          handles_sales?: boolean | null
          id: string
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
          verified?: boolean | null
          whatsapp_number?: string | null
        }
        Update: {
          agency_id?: string | null
          bio?: string | null
          created_at?: string | null
          eaab_ppra_ffc_number?: string | null
          email?: string | null
          focus_areas?: string[] | null
          focus_property_types?: string[] | null
          full_name?: string
          handles_rentals?: boolean | null
          handles_sales?: boolean | null
          id?: string
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
          verified?: boolean | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          agent_id: string
          channel: string
          created_at: string | null
          email: string | null
          id: string
          message: string
          name: string
          phone: string | null
          property_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          channel: string
          created_at?: string | null
          email?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          property_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          channel?: string
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          property_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          agency_id: string | null
          agent_id: string
          area_stats: Json | null
          available_from: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          complex_or_building_name: string | null
          country: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          enquiries_count: number | null
          favourites_count: number | null
          features: Json | null
          floor_size_sqm: number | null
          furnished: boolean | null
          garages: number | null
          id: string
          image_urls: string[] | null
          land_size_sqm: number | null
          last_updated: string | null
          latitude: number | null
          list_date: string | null
          listing_type: string
          longitude: number | null
          parking_bays: number | null
          portal_listing_id: string | null
          portal_name: string | null
          portal_urls: Json | null
          postal_code: string | null
          price: number
          price_currency: string | null
          price_period: string | null
          property_type: string
          province: string
          status: string
          street_address: string | null
          suburb: string
          tenant_screening: Json | null
          title: string
          updated_at: string | null
          video_urls: string[] | null
          views_count: number | null
          zoning: string | null
        }
        Insert: {
          agency_id?: string | null
          agent_id: string
          area_stats?: Json | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          complex_or_building_name?: string | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          enquiries_count?: number | null
          favourites_count?: number | null
          features?: Json | null
          floor_size_sqm?: number | null
          furnished?: boolean | null
          garages?: number | null
          id?: string
          image_urls?: string[] | null
          land_size_sqm?: number | null
          last_updated?: string | null
          latitude?: number | null
          list_date?: string | null
          listing_type: string
          longitude?: number | null
          parking_bays?: number | null
          portal_listing_id?: string | null
          portal_name?: string | null
          portal_urls?: Json | null
          postal_code?: string | null
          price: number
          price_currency?: string | null
          price_period?: string | null
          property_type: string
          province: string
          status?: string
          street_address?: string | null
          suburb: string
          tenant_screening?: Json | null
          title: string
          updated_at?: string | null
          video_urls?: string[] | null
          views_count?: number | null
          zoning?: string | null
        }
        Update: {
          agency_id?: string | null
          agent_id?: string
          area_stats?: Json | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          complex_or_building_name?: string | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          enquiries_count?: number | null
          favourites_count?: number | null
          features?: Json | null
          floor_size_sqm?: number | null
          furnished?: boolean | null
          garages?: number | null
          id?: string
          image_urls?: string[] | null
          land_size_sqm?: number | null
          last_updated?: string | null
          latitude?: number | null
          list_date?: string | null
          listing_type?: string
          longitude?: number | null
          parking_bays?: number | null
          portal_listing_id?: string | null
          portal_name?: string | null
          portal_urls?: Json | null
          postal_code?: string | null
          price?: number
          price_currency?: string | null
          price_period?: string | null
          property_type?: string
          province?: string
          status?: string
          street_address?: string | null
          suburb?: string
          tenant_screening?: Json | null
          title?: string
          updated_at?: string | null
          video_urls?: string[] | null
          views_count?: number | null
          zoning?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_properties: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          alert_enabled: boolean | null
          created_at: string | null
          id: string
          last_viewed_at: string | null
          name: string
          search_params: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alert_enabled?: boolean | null
          created_at?: string | null
          id?: string
          last_viewed_at?: string | null
          name: string
          search_params: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alert_enabled?: boolean | null
          created_at?: string | null
          id?: string
          last_viewed_at?: string | null
          name?: string
          search_params?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          notification_preferences: Json | null
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
