import { router } from "../trpc";
import { agentRouter } from "./agent";
import { accountRouter } from "./account";

export const appRouter = router({
  agent: agentRouter,
  account: accountRouter,
});

export type AppRouter = typeof appRouter;
