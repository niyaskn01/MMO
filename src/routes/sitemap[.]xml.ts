import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { isExperience } from "@/lib/marketplace/options";
import {
  isSitemapRouteIncluded,
  sitemapPathForLocation,
  sitemapStaticPaths,
  sitemapXML,
  type SitemapEntry,
} from "@/lib/sitemap";

// Public origin of this site. Never a preview or project-ID service URL.
const BASE_URL = "https://www.meetmeoutside.in";

const PAGE_SIZE = 1000;

const COMPANION_ROUTE = "/companions/$id";
const EXPERIENCE_ROUTE = "/experiences/$id";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));

        // Listing profiles come from the same session-free client the public catalog
        // uses, so database row-level security decides which ones are discoverable.
        const { createClient } = await import("@supabase/supabase-js");
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
        const supabase = createClient(process.env["SUPABASE_URL"]!, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              // Opaque sb_ keys are not JWTs; send apikey without the default bearer.
              if (key.startsWith("sb_") && headers.get("Authorization") === "Bearer " + key) headers.delete("Authorization");
              headers.set("apikey", key);
              return fetch(input, { ...init, headers });
            },
          },
        });

        if (isSitemapRouteIncluded(router.routesById[COMPANION_ROUTE])) {
          for (let offset = 0; ; ) {
            const { data, error } = await supabase
              .from("companions")
              .select("id")
              .order("id")
              .range(offset, offset + PAGE_SIZE - 1);
            if (error) throw new Error(`Unable to read companion profiles for the sitemap: ${error.message}`);
            if (data.length === 0) break;
            for (const row of data) {
              const location = router.buildLocation({
                to: COMPANION_ROUTE,
                params: { id: row.id },
                search: () => ({}),
                hash: "",
              });
              const path = sitemapPathForLocation(router, location, COMPANION_ROUTE);
              if (path) entries.push({ path });
            }
            offset += data.length;
          }
        }

        if (isSitemapRouteIncluded(router.routesById[EXPERIENCE_ROUTE])) {
          for (let offset = 0; ; ) {
            const { data, error } = await supabase
              .from("stays")
              .select("id,property_type")
              .order("id")
              .range(offset, offset + PAGE_SIZE - 1);
            if (error) throw new Error(`Unable to read experiences for the sitemap: ${error.message}`);
            if (data.length === 0) break;
            for (const row of data) {
              if (!isExperience(row)) continue;
              const location = router.buildLocation({
                to: EXPERIENCE_ROUTE,
                params: { id: row.id },
                search: () => ({}),
                hash: "",
              });
              const path = sitemapPathForLocation(router, location, EXPERIENCE_ROUTE);
              if (path) entries.push({ path });
            }
            offset += data.length;
          }
        }

        if (entries.length === 0) {
          return new Response(
            "No pages are included in this sitemap. Check route decisions and ancestor exclusions.",
            { status: 404, headers: { "Cache-Control": "no-store" } },
          );
        }

        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
