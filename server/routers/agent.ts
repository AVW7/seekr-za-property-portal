import { router, protectedProcedure } from "../trpc";

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
});
