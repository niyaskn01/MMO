<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shareable marketplace and supporting pages in TanStack leaf routes with individual metadata; this preserves discoverable destination and listing URLs.
- Define the shared browser icon in the root head and the homepage title in its leaf head; this avoids inherited title overrides while preserving distinct supporting-page metadata.
- Use the catalog query and public server function for listing reads, with database RLS filtering active stays and verified adult guides; this keeps visibility rules consistent across pages.
- Scope public reservations and reviews to active stays or verified adult guides, and public destinations to those containing such listings; this prevents hidden catalog data from leaking while preserving administrator access.
- Dehydrate the per-request QueryClient into router SSR state and hydrate it before client loaders; this prevents fetching the public catalog twice on initial page loads.
- Preload navigation on intent and keep public catalog caches independent of auth events; this avoids repeated reads without changing reservation freshness or private-access checks.
- Submit enquiries through an authenticated, validated server function that derives name and email from the revalidated account before scoped privileged insertion; this prevents identity spoofing while keeping admin-only request reads and public browsing.
- Store administrator permissions only in protected user_roles and enforce them in server functions and database policies; never trust browser metadata for permissions.
- Keep all colors, shadows and responsive marketplace layout styling in the global design system and map listing media through the asset registry; this supports consistent restyling and demo replacement.
- Future payment fields belong to booking requests but remain inactive until a separately authorized payment module is built.
- Drive shared account navigation from the root auth subscription and clear queries before sign-out; this keeps sign-in state visible and prevents stale private data.
- Resolve post-login destinations through an authenticated role-check server function; this keeps administrator routing independent of browser-controlled metadata.
- Synchronize confirmed/completed requests to date-only listing reservations with a database trigger and per-listing transaction lock; this prevents overlapping confirmations while exposing no traveler details publicly.
- Share date arithmetic and option sets across booking forms and listing availability; this keeps duration semantics and known choices consistent.
- Reuse a shared checkbox fieldset for multi-value listing choices, preserving repeated form field names for saving selections.

- Store ordered listing photo paths in each listing and derive the cover from the first photo; private storage signs only RLS-visible listing media for public browsing.
- Keep personal account fields in owner-readable profiles created by an auth lifecycle trigger, separate from protected roles; profile data must never grant permissions.
- Share signup password validation and visibility feedback across the account form; email submissions and optional Google sign-in remain independent actions.
- Keep existing-listing editing in a shared prefilled editor and authenticated server functions; this preserves photo ordering and the public visibility rules.
- Manage account roles through administrator-only database functions with serialized role changes and self-removal protection; this prevents privilege escalation and administrator lockout.
- Delete listings transactionally only when no current or upcoming reservation remains, retaining enquiry history and detached review records; this protects assigned travel plans.

- Store experiences in the existing stay listing infrastructure, distinguishing nonempty activity categories from reserved historical property types; derive public category filters from visible listings to support custom activities without altering historical stays or their security guards.
- Share the homepage category state with the search selector so displayed listings and search destinations always use the same selected category.
- Declare staticData.sitemap on every route and build listing URLs in the sitemap handler from the session-free, RLS-scoped catalog client; this keeps search visibility aligned with what the public site already shows without adding a second visibility rule.
