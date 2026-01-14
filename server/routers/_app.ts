import { router } from "../trpc";
import { agentRouter } from "./agent";

export const appRouter = router({
  agent: agentRouter,
});

export type AppRouter = typeof appRouter;
