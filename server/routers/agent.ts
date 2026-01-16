import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const agentRouter = router({
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;

    // Fetch agent's properties
    const { data: properties } = await supabase
      .from("properties")
      .select("*")
      .eq("agent_id", user.id)
      .order("created_at", { ascending: false });

    // Fetch agent's leads
    const { data: leads } = await supabase
      .from("leads")
      .select("*, properties(title, suburb)")
      .eq("agent_id", user.id)
      .order("created_at", { ascending: false });

    const totalViews =
      properties?.reduce((sum, prop) => sum + (prop.views_count || 0), 0) || 0;
    const activeListingsCount =
      properties?.filter((p) => p.status === "active").length || 0;
    const newLeadsCount =
      leads?.filter((l) => l.status === "new").length || 0;

    return {
      user: { email: user.email },
      properties: properties || [],
      leads: leads || [],
      stats: {
        totalViews,
        activeListingsCount,
        newLeadsCount,
        totalListings: properties?.length || 0,
        totalLeads: leads?.length || 0,
      },
    };
  }),
  updateProperty: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.object({
          title: z.string().min(5),
          description: z.string().nullable().optional(),
          listing_type: z.enum(["for_sale", "to_rent", "sold", "leased"]),
          property_type: z.enum([
            "house",
            "apartment_flat",
            "townhouse",
            "commercial",
            "land",
            "other",
          ]),
          status: z.enum(["active", "inactive", "draft", "archived"]),
          price: z.number().min(1),
          price_currency: z.string().optional(),
          price_period: z.enum(["total", "per_month", "per_week", "per_day"]).optional(),
          available_from: z.string().nullable().optional(),
          street_address: z.string().nullable().optional(),
          complex_or_building_name: z.string().nullable().optional(),
          suburb: z.string().min(1),
          city: z.string().min(1),
          province: z.string().min(1),
          country: z.string().nullable().optional(),
          postal_code: z.string().nullable().optional(),
          bedrooms: z.number().min(0).optional(),
          bathrooms: z.number().min(0).optional(),
          garages: z.number().min(0).optional(),
          parking_bays: z.number().min(0).optional(),
          floor_size_sqm: z.number().nullable().optional(),
          land_size_sqm: z.number().nullable().optional(),
          zoning: z.string().nullable().optional(),
          furnished: z.boolean().optional(),
          features: z.record(z.any()).optional(),
          image_urls: z.array(z.string().url()).optional(),
          cover_image_url: z.string().url().nullable().optional(),
          building_plans_urls: z.array(z.string().url()).optional(),
          video_urls: z.array(z.string().url()).optional(),
          agency_id: z.string().uuid().nullable().optional(),
          portal_listing_id: z.string().nullable().optional(),
          portal_name: z.string().nullable().optional(),
          portal_urls: z.record(z.any()).nullable().optional(),
          tenant_screening: z.record(z.any()).nullable().optional(),
          area_stats: z.record(z.any()).nullable().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { data, error } = await supabase
        .from("properties")
        .update({
          ...input.data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .eq("agent_id", user.id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return data;
    }),
  updatePropertyMedia: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        image_urls: z.array(z.string().url()).optional(),
        cover_image_url: z.string().url().nullable().optional(),
        building_plans_urls: z.array(z.string().url()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { data, error } = await supabase
        .from("properties")
        .update({
          image_urls: input.image_urls,
          cover_image_url: input.cover_image_url,
          building_plans_urls: input.building_plans_urls,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .eq("agent_id", user.id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return data;
    }),
});
