# Geojit Wealth Story — Customer Intelligence & Operating Studio POC 2.6

**Current phase:** Supabase-powered 20-client synthetic intelligence universe. The app is React + Vite, hosted through Netlify, with reviewer authentication via Supabase Auth.

## POC 2.6 — Consent-aware email delivery readiness (simulation only)

Evidence-led AI story creation (POC 2.5) is now demonstrated with source references. POC 2.6 moves to **the next step in the Wealth Story operating lifecycle**: preparing optional email communication safely and transparently.

### Operating workflow

**Client → Edition subscription → Story candidate → Human review → Approval → Published in-app → Eligibility decision → Email dry-run event → In-app engagement**

In **Wealth Story Studio → Delivery & Engagement**, select a fictional customer and edition. A new **Delivery Decision** panel shows the outcome and reason for each rule:

- **Active edition-level opt-in**, independent of other story editions.
- **Published, matching edition**; preparing an AI draft does not authorize sending it.
- **Fictional customer preference** restrictions and **service-first** suppression.
- **Edition freshness** (30-day demonstration window; not a financial/research validity certification).
- **Duplicate prevention** (the same edition cannot be simulated as sent twice).
- **Cadence** (minimum 7 days for weekly stories, 28 days for monthly; daily only on weekdays as an approximation).
- **Re-evaluation** against latest saved Supabase subscription, client context, edition and event records before recording a simulated email delivery.

If one requirement fails, the **Record eligible email dry-run** button remains disabled and the failed reason is shown. A successful dry run saves an event with a policy version and fictional rule outcomes. The existing **Email Preview** intentionally excludes sensitive client financial details and does not contain a real link or sending mechanism.

### Important limits

- **No actual email is sent**; no SMTP, MoEngage, provider API, outbound queue, client email address or production template is connected.
- Subscriptions and eligibility are **fictional**. Existing POC Supabase reviewer permissions are deliberately broad and are **not** suitable for real customer data.
- The client-side eligibility view and pre-insert checks are **not atomic or authoritative**. The production implementation must enforce consent, unsubscribe, schedule, finance/research currency, authorisations and idempotency on a secured server.
- The daily trading-day rule is a weekday approximation and does not consider exchange holidays, session time or content expiry.
- Editorial approval remains a demo step; no production compliance or security certification is implied.
- Mandatory/transactional/security/regulatory updates remain independently handled.

### Verification

No new SQL migration or Netlify secret is required. The existing `poc_studio_events.details` JSONB stores the dry-run policy trace. Run `npm test` only if adding an npm test script; GitHub Actions runs:

```bash
node --test tests/ai-generation.test.mjs tests/delivery-eligibility.test.mjs
npm run build
```

To demo: publish an approved fictional weekly edition for Thomas; inspect the Delivery Decision, record an eligible dry run, and verify that a repeat attempt or a fresh edition inside the cooldown is withheld. Pause Thomas's weekly subscription to see the opt-in gate suppress delivery without changing his monthly or daily preferences.

**Next:** production-capable recipient preference/consent ledger, compliance-reviewed Geojit email templates, protected deep-link authentication, research freshness governance and an authorised provider integration—not yet in scope.

## POC 2.5.2 — Reviewer authentication diagnostics

The previous generic `REVIEWER_CHECK_FAILED` response prevented us from distinguishing an expired Supabase reviewer session from a Netlify-to-Supabase network issue.

This patch retains **server-side Supabase user validation** (never trusts a browser-provided flag), retries a transient auth network failure once, and returns safe, stage-specific codes:

- `AUTH_SESSION_REJECTED`: the reviewer bearer token was rejected (401/403). Use **Refresh reviewer session & retry**, or sign out/in.
- `AUTH_TIMEOUT` / `AUTH_UPSTREAM_UNREACHABLE`: Netlify could not contact Supabase Auth. Confirm the correct Supabase project URL in the Netlify server/function variables.
- `AUTH_UPSTREAM_HTTP`: Supabase Auth returned an unexpected HTTP code (displayed, but no secret or response body is exposed).
- `AUTH_RESPONSE_INVALID` / `AUTH_USER_MISSING`: unexpected validation response; inspect Netlify Function logs.
- `CLIENT_READ_FAILED` / `RECORDS_READ_FAILED`: the caller authenticated but could not retrieve permitted client data.

The Studio adds **Refresh reviewer session & retry** and a dedicated **Retry evidence check** action. These do not modify subscription settings, SQL data or API secrets. No migration is needed.

**Testing:** After Netlify deploys the new code, open Thomas (C012) in Story Production. Use **Check AI connection** and observe the precise code. Only if it reports `AUTH_SESSION_REJECTED` should sign-in refresh be the first response; a 502 network/configuration error needs a server-side check. A successful server-key diagnostic alone does not verify AI completion.

## POC 2.5.1 — evidence retrieval hotfix

After the POC 2.5 release, both **Check AI connection / evidence preview** and **Generate with AI** could fail with generic server messages. The underlying failure was not disclosed to reviewers because the server's GET catch treated data retrieval errors as reviewer authentication errors.

The patch:
- Uses the same simple read pattern as the previously working Customer Intelligence screen (`poc_clients` and `poc_records`, with `record_id` ordering and a 1,000-record bound).
- Performs source-domain allowlisting after retrieving the records, in the source-selection module.
- Returns non-sensitive stage-specific codes: `CLIENT_READ_FAILED`, `RECORDS_READ_FAILED`, `DATA_RESPONSE_INVALID`, `EVIDENCE_SELECTION_FAILED`, `SUPABASE_NETWORK` or `REVIEWER_CHECK_FAILED`.
- Displays the evidence-panel diagnostic adjacent to its content. The OpenAI key, Netlify variables, SQL migration and 20-client records are unchanged.

**Verification:** GitHub's Vite build workflow passed. Browser-level authenticated evidence loading still needs confirmation.

**Retest:** Wait until the latest Netlify deployment is Published, then open **Wealth Story Studio → Story Production → Thomas (C012) → Weekly Investment Story**. The evidence cards should populate. Then click **Generate with AI**. If an error remains, capture the exact code shown; do not share tokens or API keys.

## POC 2.5 — evidence-led narrative intelligence (November 2026)

The first successful AI draft established end-to-end generation, but it mostly repeated product relationships. POC 2.5 upgrades the **server-side Story Context Package**, requires source references and gives Marketing a transparent review surface.

### New functionality

- **Source curation:** the authenticated Netlify function loads up to 500 synthetic records for the chosen client across service, consent, declared goals, product subscriptions, transactions, physical/RM touchpoints, digital-platform events, engagement-tool events, communications, previous editorial story context and derived states.
- **Evidence selection:** a pure function in `netlify/functions/lib/story-evidence.mjs` chooses at most **nine** source observations (maximum two per domain), using priority and date/freshness flags. It never presents a product subscription as proof of need, objective, suitability or motivation.
- **Preview before generation:** the Story Production screen displays selected source observations with record IDs, source labels, dates (when recorded) and cautions **before** invoking OpenAI.
- **Cited story generation:** OpenAI receives only the filtered synthetic observations, not the unrestricted raw customer timeline. The structured response must include `evidence_ids`; any invented IDs are rejected.
- **Persistent review trace:** each new AI story stores an `evidence_trace` JSONB snapshot with selected observations, their record IDs, which ones the AI cited, source counts and documented limitations. The story review panel distinguishes *cited by AI* from *context available but not cited*.
- **Content safeguards:** no made-up financial figures, returns, prices or research calls; no live market claims or suitability inferences. Human verification and POC approval remain separate, with real email delivery disabled.
- **Backward compatibility:** existing synthetic templates and older AI drafts stay available. Older stories without a trace are labelled accordingly.

### Required Supabase SQL update (small)

Run the complete file `supabase/migrations/20261122_004_evidence_trace.sql` in **Supabase → SQL Editor** for the **same** POC project containing the 20 synthetic clients. This adds only the `evidence_trace jsonb` column to `public.poc_story_editions`. It does not replace any clients, editions, subscription values or account login.

To verify:
```sql
select column_name, data_type
from information_schema.columns
where table_schema='public'
  and table_name='poc_story_editions'
  and column_name='evidence_trace';
```

Expected: one row, `evidence_trace | jsonb`.

### Management demonstration

1. Deploy latest GitHub changes to Netlify, sign in.
2. Open **Wealth Story Studio → Story Production**, select **Thomas (C012) / Weekly Investment Story**.
3. Check the **Evidence Selection** section. It shows the data actually eligible for AI use and where it came from. Source dates may be absent, in which case the UI says so.
4. Click **Generate with AI**. A successful new candidate is saved with `evidence_trace` and a visible AI-generated label.
5. Expand **Source records → selected insights → generated narrative** below the new story. Compare cited records and narrative claims.
6. Test **Dev (C004)**, **Isha (C020)** and a **Daily Trading Brief**. Service/opt-out priority and live-market limitations must remain visible.
7. Use the editorial review checklist before any demo approval; no actual email is sent.

### Limits and next validation

- All data are fictional. The evidence mapping is a safe, conservative prototype, **not an independently verified source-of-truth graph**; source schema mapping will require refinement against real data dictionaries and approved contracts.
- A cited source ID proves a supplied record existed, not that every natural-language claim is supported. The LLM still requires **human claim-level review** and future automatic entailment checks.
- The POC will refuse generation if no attributable observations are selected.
- No live market/research feed, automatic current trading briefing, real account segmentation, customer opt-in, production permissions, email delivery or ROI measurement is implemented here.
- Existing broad demo reviewer policies are **not** suitable for real Geojit customer information.

## POC 2.4 — AI generation troubleshooting and clearer UX

This update responds to the reviewer seeing a previously saved **Synthetic template** with no visible explanation after pressing **Generate with AI**.

- **Inline generation feedback:** Loading, success and failure messages appear directly below the generation controls in **Story Production**, not only in a global alert above the fold.
- **Safe error category:** On failure, show a specific code such as `OPENAI_AUTH`, `OPENAI_QUOTA`, `MODEL_REQUEST_REJECTED`, `MODEL_OUTPUT_INVALID`, `DRAFT_SAFEGUARD` or `GENERATION_TIMEOUT`. Never show raw API credentials, requests, tokens or client-sensitive data.
- **Clear provenance:** The latest visible story says **AI-generated candidate** or **Synthetic template · Not generated by AI**, with its creation date and editorial state.
- **No silent fallback:** On AI failure, an older stored template remains visible but is explicitly identified as **unchanged**; the app never pretends that template is a newly generated AI response.
- **Generation reliability:** Raises the model output budget and gives the reviewer actionable server-side diagnostics. The financial content restrictions and non-sending controls remain.

### Verify the fix

1. Ensure GitHub's latest commit has deployed to Netlify and hard-refresh the site.
2. Sign in and choose **Thomas (C012) / Weekly Investment Story** in **Wealth Story Studio → Story Production**.
3. Click **Generate with AI**. Read the result panel directly beneath the buttons; it shows progress and then either **saved** or an actionable **error code**.
4. If the result says **OPENAI_QUOTA**, check OpenAI Platform billing. If **OPENAI_AUTH**, check server key permissions. If **MODEL_REQUEST_REJECTED**, check the selected model and Netlify function logs. If `DRAFT_SAFEGUARD`, the AI draft was intentionally withheld for a restricted or numeric claim. If a Supabase constraint error appears, run `supabase/migrations/20261122_003_ai_drafts.sql`.
5. An AI request is verified end-to-end only if a new edition is saved and labelled **AI-generated candidate**. A server-key-detected status check is not enough.

No new SQL migration or Netlify environment variable is required specifically for POC 2.4.

## POC 2.3 — AI readiness and email experience QA

The new release adds **three controls** to the existing Wealth Story Studio without altering the 20 fictional clients, subscriptions or Supabase table schemas:

1. **Check AI connection** in Story Production: an authenticated `GET /.netlify/functions/generate-wealth-story` checks that a signed-in Supabase reviewer can reach the Netlify function and whether the server-side `OPENAI_API_KEY` environment variable is present. The key is never returned to the browser. **Key detected does NOT mean the OpenAI API accepted the key or a model generated successfully**—only `Generate with AI` can prove that.
2. **Editorial checklist:** three explicit client-side attestations (source evidence, factual claims, intended purpose and service-first tone) are required before an edition can transition from `reviewed` to `approved` using the demo UI. The checklist is session-local and **is not a production compliance record**; actual approval enforcement requires database/server authorization and audit.
3. **Email-preview experience** in Delivery & Engagement: a generic invitation to open the authenticated story. It deliberately **excludes personal figures, account-specific financial data, research details and live URLs**. No email is sent. The final production template must use an approved logo, entity-specific footer, unsubscribe mechanism, authenticated link and compliance/legal review.

### Test instructions

1. Verify latest Netlify deployment. Sign in as an existing Supabase POC reviewer.
2. Go to **Wealth Story Studio → Story Production** and click **Check AI connection**. It should show whether the Netlify Function detects a key. If the function reports missing config, confirm `OPENAI_API_KEY` is marked secret with **Functions** scope in Netlify and redeploy.
3. Run `supabase/migrations/20261122_003_ai_drafts.sql` if not already done. The small constraint update is required to save real AI-assisted drafts with `generation_method='openai_draft'`.
4. Choose **C014 George → Monthly Wealth Journey → Generate with AI**. A successful response and saved candidate verify actual API connectivity and the Supabase persistence path; inspect the text against source records. If it fails, the UI displays a specific diagnostic error where possible.
5. For a candidate, mark **Reviewed**, tick all editorial quality checks and then **Approve (demo)**. Check that approval stays disabled until all checks are complete.
6. Open **Delivery & Engagement** for the chosen client and edition to inspect the **Email Preview**. This is a visual demonstration, not a sending tool.
7. Check **C008 Vikram → Daily Trading Brief** and ensure it does not claim current/live research or prices.

No new SQL migration is needed specifically for POC 2.3. Existing POC 2.2 migration remains required.

**Remaining production gaps:** OpenAI API billing and model permission must be tested with a live request; AI-generated claims still require verification; reviewer approval/checklist controls must be server-enforced; email delivery needs a separately approved provider, proper identity/consent, unsubscribe, scheduling, template, footer and reporting infrastructure.

## POC 2.2 — AI-assisted Wealth Story drafting (November 2026)

This phase adds a **secure Netlify Function** that generates draft, structured Wealth Story candidates from the existing **fictional** client universe. This is a POC, not a production automated publishing pipeline.

**User-facing workflow:** Sign in → Wealth Story Studio → Story Production → choose client and edition → **Generate with AI** → a new `candidate` is saved in Supabase → human review → demo approval → optional in-app publication. The existing **Use synthetic template** option remains available. No AI generation sends email.

**Server function:** `netlify/functions/generate-wealth-story.mjs`

- Calls `/auth/v1/user` with the caller's own Supabase bearer token before any private data read.
- Reads one authenticated, **synthetic** client from `poc_clients` and an allowlisted subset of `poc_records`. The client never supplies arbitrary narrative facts to the AI endpoint.
- Prepares a small controlled context. Daily trading briefs deliberately omit current market figures and research, which are **not connected**.
- Calls OpenAI's Responses API on the server using structured JSON output and `store:false`, and rejects numbers, percentages, links and obvious financial-promotional claims in visible copy.
- Returns an **unapproved** draft; the browser persists it to `poc_story_editions` under the current synthetic authenticated reviewer. It does not execute trades, send email or expose secret credentials.
- The model output is not inherently verified by virtue of being structured. Human factual review and product/compliance approval are still mandatory. The demo approval state is not a production authorization or audit mechanism.
- This system handles *fictional data only*. Do not upload real customer data.

### One-time database change

In the SAME Supabase project as your 20 clients, open SQL Editor and run:

`supabase/migrations/20261122_003_ai_drafts.sql`

This small script modifies only the `poc_story_editions.generation_method` constraint to support `openai_draft` alongside `synthetic_template`. It does not modify subscriptions or existing stories.

### Configure Netlify — backend only

Go to **Netlify → Your Wealth Story site → Project configuration → Environment variables** and add:

| Variable | Value / where |
|---|---|
| `OPENAI_API_KEY` | Secret OpenAI Platform API key, stored **only** in Netlify; mark it as containing a secret and enable **Functions** scope |
| `OPENAI_MODEL` | Optional non-secret value: `gpt-4.1-mini` (the default) |

Existing public Netlify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` remain unchanged. Ensure they are available in the **Functions** scope as well as Builds, if using specific scopes. Never set `VITE_OPENAI_API_KEY`, never place `OPENAI_API_KEY` inside GitHub or commit an API key in any environment file.

An OpenAI **API** project with billing/credits is required; ChatGPT subscription alone does not provide API usage. After setting the secret, trigger a new Netlify deploy. The backend route is `/.netlify/functions/generate-wealth-story`.

### Test v2.2

1. Verify the Netlify deployment succeeds and log in as your existing Supabase demo reviewer.
2. Open Wealth Story Studio → **Story Production**.
3. Select C014 George, Monthly Wealth Journey; click **Generate with AI**.
4. If successful, the candidate appears with `AI-assisted draft` in the edition register. Read its claims against the synthetic source context before any demo review or approval.
5. Try C008 Vikram, Daily Trading Brief: it should **not** invent prices, trading calls, P&L or real-time research.
6. Try C004 Dev and C020 Isha: optional email delivery remains suppressed in the demo rules even when an in-app edition exists.
7. Use **Use synthetic template** if API billing, configuration or generation is unavailable.

**Limitations:** This is a controlled fictional draft experiment, not independently verified fact grounding. The POC reviewer RLS write policies remain deliberately broad and must never be used with real client data. Real production needs server-enforced publication transitions, validated sources and research freshness, provenance and consent, audit logs, usage caps, customer access entitlements, and a properly approved channel-delivery system.

## POC 2.1 — Wealth Story Operating Studio (November 2026)

This phase adds a **Marketing / Relationship Operations workspace** while preserving the original 20-client intelligence views, Supabase authentication, source evidence, timeline and prewritten story context.

### Working modules

- **Overview:** unique subscribed customers, fictionally prepared editions, in-app publications and recorded simulated engagement, with edition-level subscribers for daily, weekly and monthly.
- **Subscription Centre:** per-client and per-edition statuses `subscribed`, `paused`, `unsubscribed`. All values are fictional and editable for testing after migration.
- **Story Production:** prepare a **non-AI synthetic template candidate** from existing `poc_records`, review, mark approved and publish in-app through distinct manual demo actions. No model key is connected.
- **Delivery & Engagement:** checks an edition's fictional subscription, publication and service-first status before recording an **email delivery simulation**. Absolutely **no email is actually sent**. In-app reading is recorded only via an explicit demo action.
- **POC audit:** recent fictional delivery / engagement events. Approval and publication states persist in the database.

Three independent optional editions:
1. Daily Trading Brief — on trading days; only approved, current market data in production.
2. Weekly Investment Story — investing habit, relationship context and learning.
3. Monthly Wealth Journey — long-term goals, milestones and planning.

A customer may subscribe to multiple editions. In-app access is independent from optional email subscription. Mandatory transactional, risk, regulatory and essential service communications are out of scope and must remain independently governed.

### Activate persistence (one short Supabase SQL query)

Run `supabase/migrations/20261122_002_story_studio.sql` using **Supabase → SQL Editor → New query → Run** in the *same project* containing the 20 fictional clients.

The migration:
- Creates `poc_edition_subscriptions`, `poc_story_editions`, `poc_studio_events`.
- Seeds up to **60 fictional subscription rows** (20 clients × 3 editions); rerunning does not overwrite existing preference changes.
- Enables RLS, allowing authenticated POC reviewers to read and update **synthetic-only** operational records.
- Does **not** change `poc_clients`, `poc_records`, `poc_catalog`, Netlify environment variables or existing authentication.

Verify:
```sql
select count(*) as clients from public.poc_clients; -- 20
select count(*) as subscription_rows from public.poc_edition_subscriptions; -- 60
select edition_type,status,count(*) from public.poc_edition_subscriptions group by 1,2 order by 1,2;
```

Until the SQL migration is applied, the Studio displays **explicit preview mode** with illustrative subscription rows, while persistent actions are disabled. After it is run, refresh Netlify to activate saved subscriptions, story candidates, approval steps and simulated activity records.

### Suggested management walkthrough

1. Open **Wealth Story Studio → Overview**: compare active subscribers across daily/weekly/monthly editions; do not double-count clients.
2. Open **Subscription Centre**: select Thomas (C012), see multiple subscriptions, pause one edition, and confirm other editions remain unaffected.
3. Open **Story Production**: select Meera (C003), prepare a weekly investment candidate, mark reviewed, approve (demo), and publish in-app (demo).
4. Open **Delivery & Engagement**: for that approved/published edition, simulate eligible email delivery and mark an in-app view. Review the simulated event ledger.
5. Select **Dev (C004)** or **Manoj (C019)**: optional delivery is withheld where service-first priority applies. Select **Isha (C020)** to demonstrate opt-out. Real-world permissions are not recorded.
6. Open the original **Customer intelligence** workspace to review the 20-client profiles, evidence and relationship timeline. Data remains intact.

**Security disclaimer:** The authenticated RLS write permissions are intentionally broad for this synthetic-only POC and are *not* a production role/consent model. Actual Geojit customers require role-based entitlements, customer-owned consent, server-side eligibility, dual control, audit logs, unsubscribes and data protection reviews. Do not upload real data or enable real messages on this schema.

**Upcoming phase:** Add a Netlify server-side OpenAI narrative function with strictly filtered Story Context Packages, structured output, claim validation and review gates. Integrate an approved email service only after explicit consent, compliance and delivery governance are implemented.

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
