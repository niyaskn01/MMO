import { QueryClient, dehydrate, hydrate } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Catalog DTOs are JSON-safe; a string also satisfies Router's stricter
    // serialization types for Query's generic keys and mutation metadata.
    dehydrate: () => ({ queryState: JSON.stringify(dehydrate(queryClient)) }),
    hydrate: (state) => { hydrate(queryClient, JSON.parse(state.queryState)); },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
