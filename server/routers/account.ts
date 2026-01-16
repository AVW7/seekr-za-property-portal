import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import type { SearchParams } from "@/lib/types";

export const accountRouter = router({
  // Get dashboard stats
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;

    // Get saved properties count
    const { count: savedPropertiesCount } = await supabase
      .from("saved_properties")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Get saved searches count
    const { count: savedSearchesCount } = await supabase
      .from("saved_searches")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Get active alerts count
    const { count: activeAlertsCount } = await supabase
      .from("saved_searches")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("alert_enabled", true);

    return {
      savedPropertiesCount: savedPropertiesCount || 0,
      savedSearchesCount: savedSearchesCount || 0,
      activeAlertsCount: activeAlertsCount || 0,
    };
  }),

  // Get recent saved properties
  getRecentSavedProperties: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(3),
      })
    )
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { data, error } = await supabase
        .from("saved_properties")
        .select("*, property:properties(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(input.limit);

      if (error) {
        // Handle missing table gracefully
        if (
          error.code === "PGRST116" ||
          error.message?.includes("relation") ||
          error.message?.includes("does not exist")
        ) {
          return [];
        }
        throw error;
      }

      return data || [];
    }),

  // Get recent saved searches
  getRecentSavedSearches: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { data, error } = await supabase
        .from("saved_searches")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(input.limit);

      if (error) {
        // Handle missing table gracefully
        if (
          error.code === "PGRST116" ||
          error.message?.includes("relation") ||
          error.message?.includes("does not exist")
        ) {
          return [];
        }
        throw error;
      }

      return data || [];
    }),

  // Get full dashboard data (combined query)
  getDashboardData: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;

    // Parallel queries for better performance
    const [
      savedPropsResult,
      savedSearchesResult,
      statsResult,
    ] = await Promise.allSettled([
      // Recent saved properties
      supabase
        .from("saved_properties")
        .select("*, property:properties(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3),

      // Recent saved searches
      supabase
        .from("saved_searches")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(5),

      // Stats (counts)
      Promise.all([
        supabase
          .from("saved_properties")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("saved_searches")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("saved_searches")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("alert_enabled", true),
      ]),
    ]);

    // Handle saved properties result
    const recentProperties =
      savedPropsResult.status === "fulfilled" && !savedPropsResult.value.error
        ? savedPropsResult.value.data || []
        : [];

    // Handle saved searches result
    const recentSearches =
      savedSearchesResult.status === "fulfilled" &&
      !savedSearchesResult.value.error
        ? savedSearchesResult.value.data || []
        : [];

    // Handle stats result
    let savedPropertiesCount = 0;
    let savedSearchesCount = 0;
    let activeAlertsCount = 0;

    if (statsResult.status === "fulfilled") {
      const [propsCount, searchesCount, alertsCount] = statsResult.value;
      savedPropertiesCount = propsCount.count || 0;
      savedSearchesCount = searchesCount.count || 0;
      activeAlertsCount = alertsCount.count || 0;
    }

    return {
      stats: {
        savedPropertiesCount,
        savedSearchesCount,
        activeAlertsCount,
      },
      recentProperties,
      recentSearches,
    };
  }),

  // Get persona feeds - all user personas with matching properties
  getPersonaFeeds: protectedProcedure
    .input(
      z.object({
        propertiesPerPersona: z.number().min(1).max(12).default(6),
      })
    )
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      // Fetch all user personas
      const { data: personas, error: personasError } = await supabase
        .from("saved_searches")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (personasError) {
        throw personasError;
      }

      if (!personas || personas.length === 0) {
        return [];
      }

      // For each persona, fetch matching properties
      const personaFeeds = await Promise.all(
        personas.map(async (persona) => {
          const searchParams = persona.search_params as SearchParams;
          
          // Build query based on search params
          let query = supabase
            .from("properties")
            .select("*")
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(input.propertiesPerPersona);

          // Apply listing type filter
          if (searchParams.listingType) {
            query = query.eq("listing_type", searchParams.listingType);
          }

          // Apply property type filter
          if (searchParams.propertyType) {
            query = query.eq("property_type", searchParams.propertyType);
          }

          // Apply location filters
          if (searchParams.suburb) {
            query = query.ilike("suburb", `%${searchParams.suburb}%`);
          }
          if (searchParams.city) {
            query = query.ilike("city", `%${searchParams.city}%`);
          }
          if (searchParams.province) {
            query = query.ilike("province", `%${searchParams.province}%`);
          }

          // Apply price filters
          if (searchParams.priceMin) {
            query = query.gte("price", searchParams.priceMin);
          }
          if (searchParams.priceMax) {
            query = query.lte("price", searchParams.priceMax);
          }

          // Apply bedroom filter
          if (searchParams.bedrooms) {
            query = query.gte("bedrooms", searchParams.bedrooms);
          }

          // Apply bathroom filter
          if (searchParams.bathrooms) {
            query = query.gte("bathrooms", searchParams.bathrooms);
          }

          // Apply parking filters
          if (searchParams.garages) {
            query = query.gte("garages", searchParams.garages);
          }

          // Apply floor size filters
          if (searchParams.floorSizeMin) {
            query = query.gte("floor_size_sqm", searchParams.floorSizeMin);
          }
          if (searchParams.floorSizeMax) {
            query = query.lte("floor_size_sqm", searchParams.floorSizeMax);
          }

          // Apply land size filters
          if (searchParams.landSizeMin) {
            query = query.gte("land_size_sqm", searchParams.landSizeMin);
          }
          if (searchParams.landSizeMax) {
            query = query.lte("land_size_sqm", searchParams.landSizeMax);
          }

          // Fetch properties
          const { data: properties, error: propertiesError } = await query;

          return {
            persona,
            properties: propertiesError ? [] : (properties || []),
            matchCount: properties?.length || 0,
          };
        })
      );

      return personaFeeds;
    }),
});
