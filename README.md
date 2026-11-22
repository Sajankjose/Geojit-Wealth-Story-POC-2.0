# Geojit Wealth Story — Customer Intelligence POC 2.0

**Current phase:** Supabase-powered 20-client synthetic intelligence universe. The app is React + Vite, hosted through Netlify, with reviewer authentication via Supabase Auth.

## UI/UX refinement — pre-AI phase (November 2026)

A design alignment pass has been applied to the currently working React/Supabase application, before OpenAI integration.

- **Geojit design standards referenced:** `Geojit Omnichannel Brand & Experience Manual v1.1` and `Guide 02 — Visual Design System & UI Guidelines`, with the official **Geojit Website Design System in Figma** remaining authoritative for approved variants and precise components.
- **Type:** Radio Canada Big, as specified in the current v1.1 manual. Replaces the prototype's earlier DM Sans / DM Serif styling; local fallbacks are in place.
- **Colours:** locally named semantic CSS custom properties mapped to documented roles, including Text/Primary, Text/Secondary, BG & Surface/Dark, BG & Surface/CTA/Primary, active tabs, borders and status surfaces. The custom properties are centralised in `src/geojit-experience.css` so they can be replaced by exported official Figma variables.
- **UX:** clearer client-search and selection states, responsive two-column data workspace, current customer context, progressively disclosed evidence records, chronological event timeline, customer financial-summary metrics and story rationale.
- **Accessibility:** visible keyboard focus, accessible search-clear control, stateful selected client/tab labels, logical navigation and reduced-motion support.
- **Tone:** focus on customer understanding, verified synthetic data and meaningful next action, not financial promises or automatic product promotion.
- **Brand asset gate:** the interim `WS` tile identifies this **Wealth Story POC** and is **not a Geojit corporate logo**. Replace it with the approved corporate logo asset from Figma/brand library before brand sign-off. Do not recreate the logo.
- **Scope:** no Supabase table, authentication, SQL, RLS or AI key changes. The working synthetic data flow is preserved.

### Visual QA checklist

1. Verify login and authenticated 20-client list at desktop and mobile widths.
2. Search for Thomas and clear the search; use keyboard Tab/Enter to select a client.
3. Open Overview, Source evidence, Relationship timeline and Wealth Story for multiple client types.
4. Confirm legibility of long synthetic customer scenarios, numeric figures, raw JSON and chronology on narrow screens.
5. Check loading, empty, service-priority and opted-out states without hiding essential information.
6. Confirm a new Netlify build succeeds; inspect deployed fonts and contrast. Official Figma component-master dimensions and logo still require design-owner review.

## Implemented
- Client selection and search across **20 wholly fictional** personas.
- Authenticated access to Supabase tables `poc_clients`, `poc_records` and `poc_catalog` (read-only reviewer policy).
- Source evidence explorer grouped by domains such as holdings, product subscriptions, transactions, service, digital events, communications, RM visits, customer goals and derived states.
- Unified event timeline generated from the **505 fictional unified events**.
- Customer state/priority, known product and holding figures, and the stored synthetic Wealth Story with its explainable decision.
- Service-first and optional marketing suppression indications.
- A **preview-only fallback** showing 20 customer labels until Netlify has valid Supabase settings; it does NOT misrepresent labels as actual database content.
- Premium, responsive, provisional UI; final Geojit brand tokens are not yet applied.

**Not yet implemented:** OpenAI generation, actual approvals, real account data, live research, message sending, real consent engine, and real client-facing access.

## Setup in Supabase (must be done by a project administrator)
1. Open your dedicated Supabase POC project → **SQL Editor**.
2. Run the single **`wealthstory_supabase_setup.sql`** file provided as a separate download in our ChatGPT conversation. This combines the schema and complete synthetic import. Alternatively, run `supabase/migrations/20261122_001_synthetic_schema.sql` first and then seed the dataset using the separate import SQL.
3. Confirm verification:
   ```sql
   select count(*) from public.poc_clients; -- expected 20
   select count(*) from public.poc_records where domain = 'unified_events'; -- expected 505
   select domain,count(*) from public.poc_records group by domain order by domain;
   ```
4. In **Authentication → Users**, manually create an **approved demo reviewer** using a strong password. Only create accounts for authorised reviewers. Disable open sign-ups for this demo as appropriate.
5. In **Project Settings / Connect**, copy the **Project URL** and **publishable key** (the key usually starts with `sb_publishable_`). The legacy anon key also works when applicable; never use any service role or secret key in a `VITE_` variable.

**Security note:** The RLS policies allow authenticated demo reviewers to read all **synthetic** clients; there are no write policies for reviewers. This is appropriate only for the dedicated fictional POC. It must be redesigned with least-privilege row access, audit and legal controls before using actual customer information.

## Configure Netlify
Go to Netlify → your site → **Project configuration → Environment variables** and add:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://your-project-ref.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |

Scope these variables to builds as appropriate, then **trigger a fresh deploy** to make them available in the Vite bundle. The publishable key is public by design and is protected by database RLS; no secret may be included in browser code.

The build is automatically configured with `netlify.toml`: `npm run build`, `dist`, and SPA fallback. Never add database passwords, secret keys, or an OpenAI API key to GitHub or frontend environment variables.

## Test the working POC
1. Open the Netlify URL in a private browser session.
2. Log in with the reviewer account you created in Supabase.
3. Confirm **20** clients appear.
4. Select **C012 · Thomas**, inspect Overview, Data sources, Timeline and Wealth Story.
5. Check **C004 · Dev** for failed SIP / service-first logic; **C020 · Isha** for suppressed optional marketing; **C014 · George** for retirement goal.
6. Try searching for another client and checking actual evidence counts.

## Development
```sh
npm install
npm run dev
npm run build
```

Create your local `.env` using `.env.example`. Do not commit secrets.

## Data contract
The original universe contains **20 fictional clients and 21 table categories**. The SQL importer creates 20 `poc_clients`, 1,583 linked or catalog records, including 505 `unified_events`; each record retains the full source-specific payload in JSONB and a domain tag. This is a pragmatic POC ingestion model, not a final enterprise schema. We can add typed business-domain tables, indexes, customer identity rules, privacy controls and event ingestion as actual Geojit system contracts are confirmed.

## Next development milestone
Connect a **server-side OpenAI API** story generation function. The backend must prepare a filtered, consent- and quality-checked Story Context Package, request a structured response, validate the returned claims against source evidence, and record version and explanation. An LLM must never receive unrestricted raw customer tables.

## Design system
Current look is an editorial prototype, **not asserted to be Geojit's approved design system**. Replace typography, palette, logos, spacing and components only after reviewing the official Omnichannel Brand & Experience Manual/Figma variables.
