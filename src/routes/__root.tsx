import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header, Footer } from '@/components/marketplace/shell';
import { supabase } from '@/integrations/supabase/client';
import {useServerFn} from '@tanstack/react-start';
import {accountDestination} from '@/lib/marketplace/availability';
import {getAccountAccess} from '@/lib/marketplace/data.functions';

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "meetmeoutside" },
      { name: "description", content: "Beautiful Kerala stays and professional local travel guides." },
      { name: "author", content: "meetmeoutside" },
      { name: "google-site-verification", content: "4cih4Qq9fPkjXV1-3RgTnewxQraxXo7iqFJlPxKejS0" },
      { property: "og:title", content: "meetmeoutside" },
      { property: "og:description", content: "Beautiful Kerala stays and professional local travel guides." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/meetmeoutside-logo.svg", type: "image/svg+xml" },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;650;700;800&display=swap' },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin,setIsAdmin]=useState(false);
  const access=useServerFn(getAccountAccess);
  useEffect(() => {
    let active=true;let version=0;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setSignedIn(Boolean(session?.user));
      if(['INITIAL_SESSION','SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event)){
        const current=++version;setIsAdmin(false);
        if(session?.user){const userId=session.user.id;setTimeout(()=>{queryClient.fetchQuery({queryKey:['account-access',userId],queryFn:()=>access(),staleTime:60000}).then(result=>{if(active&&version===current){setIsAdmin(result.admin);if(router.state.location.pathname==='/auth')void router.navigate({to:accountDestination(result.admin),replace:true})}}).catch(()=>{if(active&&version===current)setIsAdmin(false)})},0);}
      }
      if (!['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) return;
      // Public listings do not depend on the session. Keep their cache across
      // sign-in notifications (also emitted when returning to a browser tab).
      if (event === 'SIGNED_OUT') {
        queryClient.removeQueries({ queryKey: ['admin'] });
        queryClient.removeQueries({ queryKey: ['account-access'] });
        void router.invalidate();
      } else if (event === 'USER_UPDATED') {
        void queryClient.invalidateQueries({ queryKey: ['account-access'] });
        void queryClient.invalidateQueries({ queryKey: ['admin'] });
      }
    });
    return () => {active=false;data.subscription.unsubscribe()};
  }, [router, queryClient,access]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await router.navigate({ to: '/auth', replace: true });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Header signedIn={signedIn} isAdmin={isAdmin} onSignOut={signOut} />
      <Outlet />
      <Footer />
    </QueryClientProvider>
  );
}
