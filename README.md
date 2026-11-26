# Geojit Wealth Story & Wealth Companion — POC 3.9

**Current phase:** Supabase-powered 20-client synthetic intelligence universe. The app is React + Vite, hosted through Netlify, with reviewer authentication via Supabase Auth.

## POC 3.9 — Geojit design-system treatment and illustrated Wealth Creation Map

The **existing Phase 1** story is updated in place at `https://wealthstory.netlify.app/wealth-story` (no additional site or route). The design-system fidelity pass uses the **Geojit semantic tokens already defined in `src/geojit-experience.css`**: Radio Canada Big typography, Text/Primary `#022F2D`, primary CTA teal `#09877B`, mint `#E7F7F5` and pale yellow `#FAFAED` surfaces, coral `#FF7E4D` active highlights, and approved border/focus rules. Restrained blue, warm-gold and lavender tones distinguish **illustrative map chapters**, never CTA semantics or financial risk statuses.

The newsletter now contains a full-width, responsive, illustrated five-stop **Wealth Creation Map** after the story and before preferences. Users can jump directly to it from the hero and explore five deliberately *non-scored* dimensions: Financial foundation, Protection, Growing wealth, Life goals, Review and adapt. The map:
- Invites curiosity about possible chapters (without claiming the client is falling behind, missing returns or missing products).
- Labels a dimension as recorded only where the synthetic scenario truly supports it (Thomas: holdings; George: declared goal). Otherwise displays **Open to explore · Not assessed**.
- Shows one explanatory question and an educational learning action for each selected chapter.
- Offers an **optional, initially collapsed, customer-initiated** section of related financial solutions/education for approved product categories such as mutual funds, Smartfolios, bonds/fixed income, insurance, systematic investing and financial reviews. These are generic topics, not recommendations or leads. Selecting a topic expands educational text; a demo-only interest button changes only page state and creates no lead, sales contact or consent.
- **Suppresses all optional product discovery** for Meera's unresolved synthetic service request, giving service assistance priority.
- Connects the Life goals chapter to an interactive, zero-growth goal illustration; no holdings are automatically counted toward goals.
- Exposes no financial health score, gap diagnosis or urgency countdown. The story and map remain fictional.

Implementation: `src/illustrative-wealth-map.css`, `src/IllustrativeWealthMap.jsx`, `src/lib/illustrativeWealthMap.js`, scoped design-system overrides in `src/standalone-experiences.css`, and integration in `src/WealthStoryExperience.jsx`. `tests/illustrative-wealth-map.test.mjs` checks five distinct chapters, evidence validity, new-client unknowns, opt-in product discovery and service-first suppression, alongside the existing POC automated tests.

**Regulatory boundary:** Product discovery is for customer-requested education, not suitability. No urgency is created from unverified personal data or perceived product absence. Production cross/upsell needs consent, compliance-approved eligibility/suitability handling, current product information, a verified servicing handoff and appropriate advisory/distribution controls.

## POC 3.8 — Wealth Story as an adaptive relationship edition

The Phase 1 URL `https://wealthstory.netlify.app/wealth-story` now contains an upgraded, highly personalised **fictional** customer newsletter/relationship story. It goes beyond portfolio analysis into evidence-supported discoveries, service continuity, one context-aware next step, educational tools, human-servicing concept and two-way preference/feedback UI.

A four-persona selector is available at the top for the management demonstration:

| Fictional client | Demonstrates | Confirmed evidence in POC |
| --- | --- | --- |
| **Thomas · C012** | A genuinely useful cash-flow insight, separately explaining a ₹3,000 contribution and change in investment valuation; educational next step | Source: `fictionalFinancialInput('C012')`, `fixtureIntelligence('C012')` |
| **George · C014** | A fictional client-declared retirement goal, with an adjustable educational 0%-growth monthly savings illustration. **Does not** falsely equate all holdings with earmarked goal assets. | Goal and portfolio from existing synthetic C014 fixture; scenario calculator from `demoGoalFigures` |
| **Meera · C008** | A service-first edition: a separately invented, clearly tagged 18 November fictional statement request, 20 November in-progress status, unknown next update and no verified assigned RM, with visible interaction timeline | Separately invented `SERVICE_DEMO` for the service-design POC; **not** sourced from real D365 or Supabase CRM |
| **Arun · C001** | Beginning without financial data, no fictitious investment performance, customer-chosen educational topics and optional goal arithmetic | Fictional new-customer scenario; no holdings assumed |

Each edition also supports:
- **Why am I seeing this?**: expand a factual source/explanation for the personalised insight.
- **One useful next action**: interactively explore a cash-flow reconciliation, goal scenario, service follow-up explanation, or learning topic, as relevant.
- **Human contact concept**: explain how a verified RM/servicing team could be displayed once approved CRM routing is connected. No staff member, phone, callback or appointment is fabricated as live.
- **Feedback and interest**: select a topic and say whether the edition was useful. All feedback is **local, temporary page state** only; no real CRM update, opt-in, message or consent occurs.
- **A deeper financial picture on demand**, rather than long repetitive portfolio commentary by default.
- **Adaptive editorial priority**: service update first for Meera, account evidence for Thomas, declared goal context for George and self-directed education for Arun. Explanations are concise and progressive.

Source-driven narrative rules live in `src/lib/wealthStoryOrchestrator.js`, the React page in `src/WealthStoryExperience.jsx`, styling in `src/standalone-experiences.css`. `tests/wealth-story-orchestration.test.mjs` verifies scenario separation, figure derivation, absence of invented goal funding, service priority, unknown RM, and safety of the new-client experience. The GitHub CI builds and tests all existing workflows.

### Future real-world requirements

The POC is NOT wired to the Data Lake, customer-care CRM, real RM assignments or feedback analytics. Before use with live clients: consent and authentication, financial data freshness controls, source and reasoning audit, adviser's/distributor's appropriate boundaries, sensitive-service-event privacy, user-topic preferences, suppressions for unresolved service issues, editorial approvals, and compliance/Legal/InfoSec review. Essential transactions, security alerts and regulatory notices must remain separate from any discretionary campaign consolidation.

## Separate direct URLs — Phase 1 vs Phase 2 (POC 3.7)

Two standalone, reviewer-authenticated URL paths now let management inspect each proposal without navigating through the combined research workspace:

| Experience | Direct URL | What opens |
| --- | --- | --- |
| **Phase 1 · Wealth Story** | https://wealthstory.netlify.app/wealth-story | Dedicated responsive, editorially structured, figure-led fictional Wealth Story with dated portfolio values, allocation, cash flows, cautious comparison context and a clear next step. Synthetic reviewer examples: Thomas C012, George C014 and Arun C001. |
| **Phase 2 · My Wealth Companion** | https://wealthstory.netlify.app/wealth-companion | The dedicated mobile One App W invitation → source-explained insight → service and indicative price → guided onboarding → Wealth Creation Roadmap → activation → permanent W app navigation, including educational coach and expert-service concept. |
| **Full reviewer workspace** | https://wealthstory.netlify.app/ | Preserves the existing combined Wealth Story Studio, customer intelligence, synthetic accounts and One App W Journey lab. |

Implemented with `src/lib/demoRoutes.js`, `src/WealthStoryExperience.jsx`, `src/standalone-experiences.css`, and explicit SPA rewrites in `netlify.toml`. Direct URL loading, browser refresh and mobile responsive presentation are supported by the shared Netlify SPA entry point, without creating new Netlify projects, domains, Supabase schemas or authentication systems.

**Access:** both new experiences remain behind the existing synthetic reviewer sign-in when Supabase is configured; the direct links do not bypass access control. No personal URLs, account tokens, production client data, actual communication delivery or financial advice are introduced. The Phase 1 story is a carefully curated demo from **existing fictional financial intelligence fixtures**, not a claim that published individual newsletters have been created for live clients. The Phase 2 commercial service and pricing remain hypothetical. The paths link to each other for demonstrations.

**Validation:** `tests/demo-routes.test.mjs` tests stable URL mapping, the preserved root reviewer workspace, trailing slash handling and synthetic client ID allowlisting. GitHub Actions also runs the complete existing financial, editorial, and consent-safety regression suite plus the Vite build.

## POC 3.6 — Figure-led mobile Wealth Story: a real customer story from demo data

**Management-demo goal:** Replace generic explanation-heavy copy with a coherent numerical financial story on the mobile One App W journey, using the **same** deterministic, synthetic inputs as the existing Financial Intelligence POC.

### Thomas C012 — sourced numeric narrative

The W mobile demo now **opens with Thomas** for new reviewer browser sessions (reviewers with a saved browser-session choice can use Reset and the persona selector to switch). Click **W → first insight** to see the synthetic portfolio evidence:

- **Total fictitious Geojit investments:** ₹5,42,000, dated 20 November 2026.
- **Equity:** ₹3,24,000 (~59.8%); **mutual funds:** ₹2,18,000 (~40.2%).
- **Visuals:** a proportional allocation bar on the first-click hook, then a detailed allocation card and seven-week historical valuation chart after the demo is activated.
- **Wealth Story:** open **Your Wealth Story** in the activated mobile companion. The narrative reconciles the previous weekly valuation, this week's **₹3,000 fictional net contribution**, the value change excluding flows and the resulting total of ₹5,42,000. It also displays a deterministic Modified Dietz-style weekly return estimate and the explicitly fictional, not portfolio-matched equity-market proxy.
- **Clear distinction:** additions and withdrawals are not investment gains or a measure of success. The synthetic index is not a real market quote. Neither the number, trend nor percentage establishes performance suitability, holdings attribution or a financial goal.

Every amount is calculated in `src/lib/mobileWealthStory.js` from the existing `fictionalFinancialInput('C012')` and `fixtureIntelligence('C012')`. There is **no duplicate hardcoded holdings dataset** or LLM-generated performance number. The fictional valuation dates and methodology are labelled; see source and calculation caveats on the story screen.

### Arun — financial journey even without a portfolio

Use the management panel's persona selector to choose **Arun · New to Geojit**, resetting the fictional W demonstration. Arun has no recorded holdings, contributions, market returns, investment goals or inferred needs.

The mobile hook provides a simple, clearly hypothetical savings example. After activation, **Your journey in figures** presents a working three-slider scenario:
- A target chosen by the demo user (default ₹6,00,000).
- Years to explore (default 5).
- Hypothetical monthly saving (default ₹5,000).
- Live arithmetic progress at **0% growth** (₹3,00,000 after 60 months at the defaults), difference against the target, and the monthly arithmetic needed at 0% (₹10,000 at the defaults).

This is not a forecast, suitability model, recommended monthly contribution or actual account performance. The user changes the numbers and can see the result directly. The same interactive scenario is shown within Arun's **Wealth Story**.

### Where management should click

1. Open the existing synthetic reviewer app at `https://wealthstory.netlify.app/` and **One App · W Journey**.
2. Choose **Thomas** from the right-hand demo selector and use **Reset full demo** if a previous activation is saved.
3. Tap the **W** feature tile. The first-click hook now shows the ₹5.42 lakh total and its equity/MF split, not only an abstract promise.
4. Explore the service, select a hypothetical plan, confirm data scope, select interests, preview the roadmap and complete **Activate Wealth Companion · demo**.
5. On the mobile Companion home, examine **Your journey in figures** and its seven-week trend, then tap **Understand what changed this week** or **Your Wealth Story** for the contribution-aware numeric story.
6. Switch to **Arun**, complete the simulated enrolment and adjust the hypothetical target, timeline and monthly-savings sliders. Emphasise that the service remains useful without holdings or a financial plan.
7. Return to **My Wealth Companion** for the broader experience and the existing Financial Intelligence module.

**Validation:** `tests/mobile-wealth-story.test.mjs` reconciles Thomas's total with equity/MF values and the same seven-point valuation source, verifies the weekly contribution bridge, tests the absence of new-client portfolio values, and validates 0%-growth scenario calculations and their caveats. GitHub CI also runs the existing guidance/financial tests.

**Implementation boundaries:** This remains a simulated mobile app, *not* a production One App integration. All valuations are invented for demonstration, not actual customer information or market data. A production service requires verified brokerage/MF data, validated valuation/flow methodology, product and advisory compliance review, real consent, expert-support operations and publishing controls. No new Supabase migration or Netlify variables are needed.

## POC 3.5 — The first-click “wow” moment and genuine four-part service promise

The first click on the **W** icon no longer takes customers directly into a pricing card. It now reveals a thought-provoking, *source-explained insight*, intentionally distinct from direct sales copy:

- **New fictional client Arun:** “Your investment journey hasn’t started here yet. Your financial future already has questions worth asking.” The app explicitly reports no Geojit investments recorded; it does not assume Arun has no assets or goals elsewhere.
- **Existing fictional investor Thomas:** “You can see what your investments are worth. But do they tell your whole story?” A dated fictitious Geojit snapshot shows ₹5,42,000 across equity and mutual funds as of 20 November 2026, with source and completeness disclosures. It does **not** imply that Thomas needs to purchase or switch investments.

A **Why am I seeing this?** disclosure expands source, date and limitations. Neither scenario draws from real data or silently uses digital-behaviour profiling. The management panel's persona selector changes the fictional insight scenario and resets simulated activation; it does not switch a real client account.

### Clear value-added service promise

The next screen presents four capabilities as one coherent experience:

1. **Your Wealth Creation Roadmap** — a customer-controlled educational roadmap and optional next learning steps, interactive in the POC.
2. **A dedicated expert when you need one** — proposed human support to clarify questions and navigate authorised service channels. **Not live in the POC; no actual expert, real-time access, 24/7 service guarantee, appointment or eligibility is promised.**
3. **Your continuing Wealth Story** — insightful, editorially governed perspectives connected to verified facts and customer-selected themes. Existing synthetic story demonstrations are not a live subscribed editorial service.
4. **A guiding coach whenever you explore** — a working scripted educational Q&A in the One App demo. It never provides investment advice, selects a product or creates a request for commercial follow-up.

The mobile demonstration retains pricing, consent-neutral data review, self-directed profiling, roadmap reveal and post-activation W navigation. The activated Companion now contains **Guiding Coach** and **Expert Support Concept** views; the expert view has no live booking action. The broader existing-customer Wealth Companion home also lists all four propositions, with honest availability labels.

### Reviewer demonstration

1. Open the Netlify reviewer app and its default **One App · W Journey** workspace.
2. Before enrolling, use the right-hand management panel to choose **Arun** or **Thomas**.
3. Click **W** on My Watch or within More. Read the insight first, then expand **Why am I seeing this?**
4. Tap **Discover what Wealth Companion can do**, review four services and their availability descriptions, then inspect the example plans.
5. Complete the fictional educational enrolment, choose interests and activate W; inspect the permanent bottom-nav shortcut.
6. From the activated Companion, open **Your guiding coach** and explore its scripted questions; open **Dedicated expert concept** to discuss the intended support pathway and why operational approval is needed.
7. Revisit the roadmap and Wealth Story. Use **Reset full demo** to repeat the before/after experience.

### Governance

The hook is rendered by deterministic, allowlisted synthetic context rules from `src/lib/companionMarketing.js`, not open-ended AI generation. It must never invent a financial goal, need or portfolio figure; an external-asset gap is unknown, not a marketing opportunity. Four distinct service claims carry availability tags. Pricing remains hypothetical. Specialist availability, credentials, response time, client entitlement, advice/distribution segregation, AI coaching, publication workflows and customer permissions all require actual business and Compliance approval before any client-facing promise.

The suite `tests/companion-marketing.test.mjs` checks factual hook evidence, dated Thomas figures, new-customer unknowns, explicit availability, coach limitations and no automatically created lead.

## POC 3.4 — One App mobile W icon → pricing → guided roadmap → persistent menu

### What management can now demonstrate

The experience starts **inside a simulated mobile One App** resembling the uploaded My Watch/Watchlist recording's navigation structure: watchlist context, compact trading-screen header and a bottom menu. The market watch is deliberately *illustrative* and does not claim to stream stock prices. The prominent **W / New: Wealth Companion** invitation is a real clickable entry.

The top-level reviewer workspace now opens the **One App · W Journey** demo by default. Existing Customer Intelligence, Wealth Story Studio and My Wealth Companion modules remain accessible from the left sidebar.

**Before activation**, W is a feature-discovery invitation:
1. **Discover W** on the simulated One App watchlist, or through the **More** menu.
2. **Explore the service and price concepts**: Essential (*Included concept*) or Journey Plus (*₹999/year hypothetical research price*). The fee is illustrative and has **not** been approved; no checkout or actual paid entitlement is provided.
3. **Review data limits**: the new fictional Geojit account shows no portfolio holdings, transactions or declared goals, and makes no inference about holdings outside Geojit.
4. **Select interests** (investing, financial goals, flexibility or protection), plus an on-demand/monthly/quarterly *review concept*; no risk-profiling, product diagnosis or actual communication permission.
5. **See the Wealth Creation Roadmap and action plan**, selected through the existing common educational roadmap engine. An expandable explanation shows why each action appeared and that no product gap was inferred.
6. **Activate Wealth Companion (demo)** only after explicitly confirming the fictional scope, selecting at least one topic and acknowledging simulation-only enrolment.

**After activation**, the app visibly changes:
- A persistent **W / Wealth** shortcut appears in the bottom app navigation.
- The **More** menu changes to **My Wealth Companion**, replacing the pre-activation discovery item.
- Opening W takes the customer directly to an ongoing Wealth Companion screen with the first educational next step, a small action plan, and an optional Wealth Story.
- The customer can mark a step as explored or choose *Maybe later*. Their choices are saved to this browser tab's `sessionStorage`, so the experience survives refresh in the same tab but is not synced to a real account.
- The right-hand manager panel provides **Show One App home**, **Show app menu**, and **Reset full demo**, allowing a before/after demonstration on demand.

### Content and controls

- The demo uses `src/OneAppDemo.jsx`, `src/one-app-demo.css` and `src/lib/oneAppDemo.js`. Financial roadmap selections reuse the same customer-chosen `createLearningRoadmap` engine as POC 3.3.
- The fictional new customer begins with **no investment record or verifiable returns**. The W experience does not read the existing Thomas valuation fixture or manufacture personal financial performance.
- **₹999/year** appears only as a clearly marked *hypothetical price research input*, not a published Geojit plan.
- No card payment, subscription contract, real account activation, CRM lead, risk-profile inference, marketing permission, trading action or personalised securities recommendation is generated.
- The first Wealth Story is a prewritten educational chapter, not a published or AI-generated real-customer edition.
- The regression suite includes `tests/one-app-demo.test.mjs` for W activation gating, price disclosure, customer-selected roadmaps, absent account data, consent isolation and the distinction between educational actions and investment outcomes.

### How to use it

1. Sign into the existing reviewer-only Netlify POC at `https://wealthstory.netlify.app/`.
2. The first workspace is **One App · W Journey**. Select the W feature tile within the simulated mobile app.
3. Select Essential or inspect the hypothetical Plus price, continue to review data limits and choose interests.
4. Preview the roadmap and confirm **Activate Wealth Companion · demo**.
5. Use the mobile bottom navigation to visit Watchlist, then the new **W / Wealth** menu item. The post-enrolment customer home opens immediately.
6. Open **More** to show the new permanent Wealth Companion item. Simulate learning progress and access a Wealth Story.
7. Use **Reset full demo** to restore the pre-enrolment W invitation; no existing synthetic customer records are changed.

This is a **management experience concept**, not a modification to the production One App. The visual styling is inspired by the attached watchlist video but does not replace or alter actual Geojit trading screens. A live implementation would require the One App design-system integration, legal classification of the service, approved subscription terms and data permissions, secure entitlement persistence, verified source connectivity and server-side guidance governance.

## POC 3.3 — Unified Companion Experience Engine & Continuing-Value Lab

**Goal:** Bring brand-new and established customer journeys under one common educational roadmap selection system, and demonstrate how ongoing value could be evaluated without confusing engagement with financial benefit.

### What is implemented

1. **One shared rules module:** `src/lib/companionExperience.js` adapts the existing customer-selected `createLearningRoadmap` engine for both the fictional new-customer lifecycle and the established investor. The canonical educational step IDs, reasons and explicit-interest logic are shared. Missing investments are never a diagnosis, goal or product recommendation.
2. **New-client integration:** `Customer Experience → New Client Journey` now renders educational steps through the shared engine. A new account still starts with no holdings, performance or goal. When a customer explicitly marks a learning step explored, the shared next-action selector moves on without treating the step as financial progress. Prewritten stage-specific Wealth Story explanations remain separate from production AI publication.
3. **Existing-client integration:** `Customer Experience → Wealth Companion` now consumes the shared engine for roadmap selection while preserving the previous One App onboarding and functional destination links (financial picture, Wealth Map and Wealth Story). This creates one coherent underlying decision architecture across personas, without merging their fictional data.
4. **Value & Lifecycle Lab in Marketing Studio:** under `Wealth Story Studio → Value & lifecycle lab`, a reviewer can switch between the new-client scenario and an existing-customer profile. The lab displays its stage, known/unknown portfolio context, common educational actions and why they were selected.
5. **Continuing value demonstration:** reviewers can manually simulate educational learning, clarified questions, goal-scenario exploration, revisits and fictional story reads. `valueSignals` counts these narrowly scoped session events separately. It **does not** claim to measure customer comprehension, net worth, goal progress, retention, permission to contact, real product sales or subscription ROI.
6. **Regression safeguards:** `tests/companion-experience.test.mjs` checks shared roadmap behaviour, missing-goal rules, zero-data handling, investor context, no product recommendations and separation between simulated engagement and real customer outcomes.

### Management walkthrough

- Open `https://wealthstory.netlify.app/`, sign in, then go to **Wealth Story Studio → Value & lifecycle lab**.
- Select **New client · No investment history**. Walk from **Just joined** through the four fictional milestones and observe how the same roadmap engine presents useful educational steps without pretending an investment portfolio exists.
- Switch to **Existing client · In-scope investments**. The engine uses the selected financial interests and permits a limited financial picture, but still doesn't infer a missing product or a personalised recommended allocation.
- In **Value evaluation**, simulate a learning step or clarified question. Explain that these are test signals; survey-based usefulness and true behaviour change must be measured in a controlled pilot.
- Open **Customer Experience → New Client Journey** to demonstrate Arun's interactive zero-investment lifecycle, then switch to **Wealth Companion** for existing clients and the complete One App enrolment.
- Discuss the practical next milestone: securely persist customer-consented learning preferences, reconcile real financial sources, conduct a compliance-approved user study, and test an approved value-added service without assuming that all clicks are valuable.

### Important scope boundaries

The lab is fictional, local browser-session based and explicitly manually triggered. It does not send notifications, activate billing, create advice, run product recommendations, route opportunities to CRM, or access a real customer. Real source contracts and client-scoped entitlements have **not** been implemented. No Supabase migration or new Netlify environment variables are required.

## POC 3.2 — Brand-new client lifecycle: value before investments

**Demonstration objective:** Show a complete Wealth Companion relationship for a fictional newly joined Geojit client **with no account holdings, investment transactions or declared financial goals**. This is deliberately separate from the established Thomas synthetic investment demo.

### What is now built

In **Customer Experience → New Client Journey**, reviewers can enter a fictional beginner experience with **Arun** and move through four editable management scenarios:

1. **Just joined (Day 1)** — no portfolio values to show. The customer chooses a topic to explore (goals, investing basics, money habits or an open starting point). The first meaningful moment is a plain-language explanation and a short, optional learning roadmap—not a product recommendation.
2. **Exploring (Week 1)** — the customer sees an appropriate educational Wealth Story about what they have explored and chooses the next learning step. Marking a step explored is **not** treated as financial progress, wealth or investment suitability.
3. **Goal defined (Weeks 2–4)** — the reviewer may enter a fictional *customer-declared* goal, target amount and horizon through a customer-controlled calculator. The default calculation assumes **0% nominal growth**, illustrates arithmetic saving only and is **not an investment instruction**. Merely selecting the phase does not invent a declared goal.
4. **Investment started (Month 2+)** — the scenario adds one manually simulated **₹3,000 mutual fund contribution**, with no asset valuation, gain, benchmark or returns inferred. The Wealth Story evolves to explain that contributions and market growth are not the same.

The **Management simulation** selector makes it possible to demonstrate progression or return to an earlier stage without waiting weeks. Moving back to a pre-investment phase removes later fictional holdings from that view. Nothing is written to actual customer records, portfolios, advisory systems or communication services.

### Customer-first editorial value

- **Day one:** An empty account still gets a useful, understandable first chapter and customer-selected educational next step.
- **Later:** The customer can revisit learning activities, enter their own goal, compare zero-return scenario arithmetic and progressively understand the account.
- **After a fictional contribution:** A new Wealth Story describes the activity without claiming returns, recommending securities or assuming the goal is on track.
- **At any time:** The customer can mark a learning step explored, defer their next decision, or leave. No urgency or product-purchase pressure is introduced.

### Management walkthrough

1. Sign in to the existing Netlify prototype, open **My Wealth Companion → New Client Journey**.
2. Start with **Just joined** and click **Discover where to begin**.
3. Select **Understand investing** (or another customer-led topic), read the first-value educational perspective and open the starting roadmap.
4. Use the stage selector to show **Exploring**. Mark an educational step complete and open its corresponding Wealth Story.
5. Select **Goal defined** and click **Explore a goal scenario**. Choose a fictional goal label, target and years; show the transparent, zero-growth monthly saving calculation.
6. Move to **Investment started** and compare the new Wealth Story. Emphasise that a first contribution does not establish portfolio return or goal adequacy.
7. Press **Restart demo** to reset the scenario without affecting Thomas or other synthetic clients.

This flow uses a new isolated deterministic module `src/lib/newClientLifecycle.js` and the interactive `src/NewClientLifecycle.jsx` with responsive stylesheet. The latest CI includes `tests/new-client-lifecycle.test.mjs`.

**Important scope:** Arun here is a standalone fictional scenario, not a new `poc_clients` row. It does not call Supabase, create a real investment or publish an actual AI-generated story; its evolving story text is prewritten, stage-specific editorial copy. Browser-session storage preserves only scenario state if available. No SQL migration or environment variable is needed.

### Subsequent technical work

To make a production pilot credible, Geojit would need an approved client lifecycle-state engine, verified account/transaction feeds, permissioned profile persistence, content provenance and publishing, channel consent, compliant product discovery, authorised routing and measurable customer value. The regulatory classification of financial planning and paid guidance remains subject to Legal and Compliance review.

## POC 3.1 — One App → Wealth Companion: management-ready guided onboarding

The **first visit to My Wealth Companion** now begins with a complete, interactive fictional One App discovery-to-onboarding experience rather than a bare checklist. The prototype uses a reviewer-only synthetic Supabase account and **does not** activate a paid account or advisory relationship.

### The six-screen customer story

1. **One App discovery** — a polished conceptual One App home, investment tools and a clickable `My Wealth Companion` tile under a new value-added experience. Other tiles are non-interactive visual context. The top-level reviewer navigation remains accessible.
2. **Service introduction** — makes the value proposition clear: understanding your financial picture, a self-chosen educational roadmap and an ongoing Wealth Story. The promise is help without sales pressure.
3. **Permissioned account prefill** — the customer deliberately chooses `Review my available information` before any onboarding query is made. The app then fetches **read-only synthetic Supabase poc_records** restricted to the selected fictional customer and four allowlisted domains (product relationships, transactions, previously shared goal data and service cases). It **does not** read browsing/engagement, meeting details or external financial data. The flow also provides `Continue without prefill`.
4. **Review and confirmation** — presents source availability, dated counts, limits of what Geojit knows and a separately labelled *fictional valuation* from the existing demo engine. The customer must acknowledge that these data do not represent their complete wealth, needs, suitability or investment advice. Unknown information remains unknown.
5. **Light-touch profiling** — customers choose areas they *want to understand*: investing, goals, protection, flexibility and review. They select a preferred rhythm, with optional future check-in interest off by default. This is neither risk profiling nor financial planning advice, and **does not grant real channel permission**.
6. **Roadmap reveal and local activation** — a preview shows a personalised customer-facing welcome, chosen focus summary, review rhythm, and an initial roadmap created solely from those choices. An expandable `Why these steps?` explanation clarifies the logic. `Enter my Wealth Companion` saves the learning preferences in the browser session and opens the service dashboard.

The onward experience links the customer to **their roadmap → Financial Picture → Wealth Map → Wealth Story**, with each optional step allowing `Mark explored`, `Maybe later`, reopen or change focus.

### Live data access versus simulation

**A real read-only query takes place against fictional Supabase poc_records when selected.** The returned domain summary is actually computed from the fictional records in that POC database. It is not a real client data connection. The illustrative portfolio valuation is independently generated from a deterministic **synthetic fixture** and never represented as a prefilled, live portfolio value.

The service activation is simulated in `sessionStorage`. No data is posted to an entitlement, billing, marketing consent or advisory system; no email or CRM workflow is triggered. The demonstration never requires a new SQL migration or environment variable.

### How management should test it

1. Sign into the existing POC: `https://wealthstory.netlify.app/`.
2. Select **My Wealth Companion** in the sidebar and choose **Thomas C012**.
3. On the simulated **One App** screen, select the featured **My Wealth Companion** tile.
4. Explore the service promise and click **Start my journey**.
5. Click **Review my available information**. Read the account-context summaries and confirm the limitations. Optionally replay with **Continue without prefill** to demonstrate graceful onboarding when data are unavailable.
6. Choose **Understand my investments** and **Explore a financial goal**, plus a review cadence. Leave optional future check-in interest unticked.
7. View the personalised roadmap, expand **Why these steps?**, then **Enter my Wealth Companion**.
8. Show the next helpful educational action, detailed roadmap, Wealth Map and ongoing Wealth Story.
9. Once onboarded, select **Replay One App onboarding** from the Companion header to run the journey again; session data remains until explicitly re-saved or the browser session ends.
10. Open **Wealth Story Studio → Wealth Companion POC** to discuss service economics, advice-versus-guidance boundaries and required governance approvals.

### Guardrails and future real implementation

- **Before real use:** authorised One App entry, real consent and access-control checks, source reliability, financial aggregation/scope explanations, customer identity permissions, event and channel governance, accessibility and documented regulatory classification.
- Customer-selected educational focus is **not a suitability profile**, and selecting a product-learning topic is **not consent to sales contact**.
- The POC recommends **no financial products, securities, allocations, financial-health scores or investment action amounts**.
- Premium plans are unpriced concepts; a real subscription must not be sold before Compliance, Legal, Product and Advisory approval.

**Current product narrative:** *One App brings the service to the customer; Wealth Companion helps them choose a direction; the roadmap gives an educational path; Wealth Story keeps the journey meaningful over time.*

## POC 3.0 — Geojit Wealth Companion (self-directed service concept)

**Product premise:** A customer-first financial understanding and educational roadmap that helps users explore questions relevant to their wealth journey, with Wealth Story as an ongoing editorial extension. The product is **not a personalised investment advisory service or an active paid subscription**. All accounts and figures remain fictional.

### What is now built

**Customer entry point:** the app's **My Wealth Companion** reviewer navigation now opens an upgraded customer experience. The default tab is **Wealth Companion**; the existing Wealth Story, Financial Picture, Wealth Map, Guided Pilot and Preferences are preserved.

**Guided discovery and enrolment:** customers choose one or several topics—understand investments, explore goals, financial protection, financial flexibility or wider review. They can set a preferred review rhythm and express a *demonstration-only* interest in future optional check-ins. No real consent is obtained and no messages are scheduled or sent.

**Live educational roadmap:** `src/lib/wealthCompanion.js` constructs a short roadmap **only from explicitly selected topics**, never missing Geojit products, inferred investment needs or financial-health scores. Each action has an explanation and an optional path to a working part of the POC. The customer can mark a step explored, defer it, reopen it, or choose another focus. Progress reflects *explored educational tasks*, never portfolio performance or the probability of reaching financial goals.

**A genuinely proactive but controlled experience:** `shouldOfferProactiveCheckIn` refuses to trigger outbound communication without customer-selected cadence, an affirmative check-in preference, separately verified channel permission, a genuinely verified material event and no service-priority block. The current POC has **neither live events nor permissioned outbound delivery**, so its home screen correctly says there is no new action required merely to generate engagement.

**Subscription concepts:** the service-introduction screen includes **Essential** and **Journey Plus** as explicitly unpriced/unauthorised concepts. A reviewer can select a preferred service concept; this does not take payment, activate an entitlement, create an advisory engagement or move any customer into a chargeable tier. Included features are exploratory digital utilities and educational functionality, not personalised buy/sell/hold calls.

**Studio for management:** **Wealth Story Studio → Wealth Companion POC** outlines the conceptual tiers and a feature-by-feature boundary matrix for utility, education, distribution and advice. It gives stakeholders a review checklist for fees, conflicts, legal entity, suitability, product-specific permissions, data sources, consent and authorised billing.

**Local reviewer progress:** in this MVP the demo configuration and selected roadmap actions are kept in the browser's `sessionStorage`, namespaced to the fictional client ID and scoped to the current session. This deliberately avoids creating new account-wide entitlements, real consent, charged subscriptions or sales records. Nothing in this POC is an actual subscription. There is **no SQL migration or new Netlify environment variable required**.

### Show the value to management

1. Open the Netlify POC, sign in as the existing synthetic reviewer and select **My Wealth Companion**.
2. Choose fictional **Thomas (C012)**. The upgraded welcome screen invites him to **Build my learning roadmap**, not buy a product or pay for advice.
3. Choose **Understand my investments** and **Explore a financial goal**. Select *Monthly perspective* if desired, leave optional check-in interest disabled, then create the roadmap.
4. On the Companion home, see the first **current focus** with the evidence logic clearly explained as **customer-selected interest**, not an AI diagnosis or sales opportunity.
5. Open **View my roadmap**, choose **Explore** to move into Financial Picture or Wealth Map; return and select **Mark explored** or **Maybe later**. This does not change financial goals, investment performance or holdings.
6. Read an already-approved **Wealth Story** to demonstrate the service's continuing communication layer.
7. Select **Explore service options** and switch between Essential and Journey Plus, observing that both are **non-purchasable, without approved prices**.
8. Open **Wealth Story Studio → Wealth Companion POC** for the business model, advisory/distribution separation and pre-pilot approval matrix.
9. Refresh the page in the same browser tab/session to see local progress retained. Closing the browser session may erase it, by design.

### Operational and regulatory scope

**Within the POC:** fictional customer-specific factual views, educational explanations, user-entered goal scenarios, an explicitly topic-selected roadmap, optional reading, a genuine-guidance gate and subscription *concept* UI.

**Outside the POC:** personalised financial planning conclusions, suitable product recommendations, advice on buy/sell/hold or switching investments, real investment advice fees, live entitlement/payment services, legal consent or marketing opt-in, automated CRM/lead routing, real client records, open banking aggregation or real autonomous outreach.

Calling the service 'guidance' does not itself determine regulatory classification. Compliance and Legal must evaluate the actual feature-level outputs, fee design, entity structure and advisory/distribution relationships before customer availability or monetisation.

### Next product-validation tasks

- Test the experience with fictional newcomer, mixed investor and retirement-focused personas, then with approved recruited real users in a research environment **without using real investment data in the POC**.
- Validate the roadmap's usefulness against customer benefit, not product-click volume.
- Run an opt-in qualitative study of willingness to pay for clearly separated digital utilities; pricing and proposed entitlements are not approved.
- Obtain an explicit compliance classification for each informational, educational, planning, communication and distribution feature.
- Only after approval: design durable customer-scoped plan storage, secure authentication, verified event ingestion, actual permission management, authorised billing and adoption metrics.

## Connected newsletter-to-plan pilot

In **Customer Experience → Guided pilot**, reviewers can walk through a separate fictional weekly insight, a short educational article, a three-scene captioned video storyboard, scripted contextual assistant answers, and a provisional education-goal picture. The pilot is available even when no edition has been published in Supabase; it is deliberately **not** calculated from whichever fictional client is selected in the customer preview.

- The sample value bridge separates ₹3,000 of SIP cash flow from approximately ₹1,200 of remaining movement; it does not label either as investment return or compare the mixed portfolio with an equity benchmark.
- Learning content is optional and skippable. The storyboard is not a produced video; the assistant is not a connected AI service. A product-selection question stops at the approved advisory or distribution handoff.
- The plan does not show a comparison until the SIP is explicitly assigned, a target is entered, and outside savings are either entered or consciously excluded. The 0% illustration is arithmetic, not a return forecast or product prescription.
- **Save this view · demo** stores only fictional inputs in the browser tab's session storage. It creates no Supabase record, lead, email, adviser request or real customer plan.

Suggested walkthrough: Weekly insight → Read or Watch → Ask “Does my SIP support my education goal?” → What I used → Goal picture. First show the unknown state, then confirm the SIP and target, and deliberately choose how to treat outside savings. Finally ask “Which fund should I buy?” to demonstrate the boundary.

## POC 2.7.3 — Adaptive Wealth Creation Map and Genuine Guidance Gate

**Foundation:** Proactive in understanding. Genuine in guidance. Respectful of every decision.

The experience is guided by a hard principle: a missing Geojit subscription does **not** prove a financial gap, and a useful educational recommendation should remain helpful even when the customer buys nothing.

### Customer experience

- **Your Wealth Map** appears as a new tab in Customer Experience and as a direct handoff from a published Wealth Story.
- Five customer-chosen dimensions: **Financial foundation, Financial protection, Growing wealth, Life goals, Review and adapt**. These are explorations, not grades or a required product checklist.
- Each dimension shows **Known in Geojit / Declared in demo / Not assessed / Available to explore** as applicable, with explanations about unknown outside assets and non-inference. There is no overall financial health score, red "missing product" warning or assumption of need.
- Every area provides **one useful question and an educational answer** before any product information. General information about MF, Smartfolios, insurance or PMS is optional and expands only after the reviewer deliberately chooses a relevant topic. It is **not a suitability assessment**, offer, transaction or product recommendation.
- **Life goals** includes a deterministic client-controlled planning scenario with an explicit fictional target, existing savings, time horizon and a nominal growth assumption. It compares a user-chosen scenario with a 0% growth illustration. There is no projection of actual market performance and no recommendation that an investment is required. Calculation is in `src/lib/genuineGuidance.js`.
- **Genuine Guidance Gate:** the UI can explain the customer benefit, customer-initiated topic selection, service-first restrictions, commercial neutrality and the absence of verified suitability. Neutral education remains available when a service issue exists, while optional product discovery is withheld.
- **Not now** provides a real exit without tracking it as disinterest or non-compliance.

### Marketing operations

- The Studio has a **Guidance Insights** tab, reading `public.poc_guidance_events`. It counts distinct fictional customers, explicitly saved interests and explicitly requested follow-ups separately.
- Viewing a map card or expanding educational text does **not** send or record a lead. The event ledger receives a record only when the reviewer presses **Save my interest · demo** or **Request more information · demo**.
- Such records are **synthetic demonstration events**, not customer permission to contact, a real CRM opportunity, or evidence of investment suitability. Nothing is sent to customers, RMs or external systems.
- The marketing panel handles the missing table gracefully until the optional migration below is run.

### One required Supabase migration for saving interests

Use **Supabase → SQL Editor** in your existing **synthetic 20-client POC** and run:
`supabase/migrations/20261122_006_guidance_interests.sql`

This adds an authenticated, synthetic-only `poc_guidance_events` table with event type, client ID, topic, explicit-action markers and creation timestamp. **It does not change your existing clients, valuations, stories, subscription records, Netlify API keys or any previous migration.**

Verification:
```sql
SELECT COUNT(*) FROM public.poc_guidance_events;
```
Initially **0 rows**. Rows appear only when a reviewer explicitly records an interest in the fictional customer preview.

### Management demonstration

1. Sign in to the deployed Wealth Story app and open **Customer Experience → Thomas (C012) → Your Wealth Map**.
2. Explore *Growing wealth*: the map acknowledges a limited Geojit investment context without assuming total assets or an undisclosed financial gap.
3. Expand Mutual Fund or Smartfolios educational information. Explain the Genuine Guidance Gate. Then click **Not now**; the app creates no demo interest record.
4. Explore **Life goals**: adjust the target, horizon, existing savings and hypothetical growth. Show why a client-controlled goal scenario is more genuine than a model-inferred product pitch.
5. Click **Save my interest · demo**. In **Wealth Story Studio → Guidance Insights**, refresh and verify the explicit choice is visible.
6. For a fictional service-first case, show how optional product information requests are withheld while neutral education remains available.
7. If you want to demonstrate intent to speak with someone, choose a specific educational topic and click **Request more information · demo**. Check that the Studio distinguishes this from an interest-only action and openly states no actual RM contact was made.

### Limits and production safeguards

- All valuations, client labels and interaction data are fictional; any "Known in Geojit" state refers only to mock in-scope data.
- The goal planner is nominal and excludes inflation, fees, taxes, shocks and suitability; do not use the scenario as a personal contribution prescription.
- Product information is generic and does **not** imply personalised suitability or eligibility. PMS and other regulated products require additional eligibility and risk/compliance gates before live presentation.
- The POC RLS permits all signed-in fictional reviewers to access the synthetic dataset. **Do not use for real clients**. Production requires customer-scoped RLS, actual consent and audit records, server-side eligibility and policy enforcement, regulatory review and opt-out processing.
- Genuine guidance should be evaluated for **customer benefit and commercial neutrality**, and commercial ROI should be measured by genuine incremental outcomes—not simply clicks or generated lead counts.

**Next:** build a stronger needs-discovery conversation for each map area, connect approved Geojit planning tools and add measurement of customer benefit with an experiment/control cohort before real distribution.

## POC 2.7.2 — Wealth Intelligence & Journey Engine (synthetic demonstration)

**Core idea:** A Wealth Story should explain what happened in the market, what happened in a customer's investments, why the two may differ, and what the longer-term wealth journey reveals—without disclosing behavioural tracking or inventing real financial data.

### Built in this release

- **Deterministic financial intelligence:** `src/lib/wealthIntelligence.js` contains explicit, reproducible, synthetic weekly portfolio valuations, external cash flows, two-asset allocation figures and a **fictional broad-equity benchmark proxy** across seven dated weeks ending 20 November 2026.
- **All twenty fictional clients:** deterministic customer-ID-based illustrative inputs, including Thomas C012 (₹5.42L latest fictional portfolio value with ₹3.24L equity and ₹2.18L mutual funds), and a purely fictional explicitly tagged goal case for George C014. Never use these as actual holdings or market prices.
- **Weekly return:** calculates a Modified Dietz-*style* estimate as `(ending value - starting value - external net flows) / (starting value + 0.5 × external net flows)`. The midpoint assumption is only for this demonstration. A production TWR/XIRR requires actual dated cash flows, account coverage, valuation frequency and approved calculations.
- **Like-for-like period:** computes the fictional benchmark-proxy change for the same end dates and shows the difference in **percentage points** (not rupees, not percentage growth in benchmark-relative wealth).
- **Explainable limitations:** shows change in value, external net contributions and change excluding flows; explicitly states that without instrument-level valuations and attribution a performance gap **cannot** reliably be explained by a specific stock, fund, sector or investing decision. The invented broad-equity proxy is **not a validated matched benchmark** for a mixed-product portfolio.
- **Wealth journey:** an SVG value timeline, contributions over the illustrated period, a clear disclaimer distinguishing contributions from investment returns, and a goal-progress indicator only for the explicitly tagged fictional goal case. No unconfirmed goal or risk profile is inferred.
- **Contextual tool exploration:** three interactive handoff concepts—investment review, goal planning and RM conversation. They show the intended experience and disclose that no live Geojit tool or CRM request is connected.
- **Customer experience:** new **Your financial picture** section in the existing `src/CustomerExperience.jsx`; the latest published story includes a gentle link to the richer view. Story reading, subscription editing, customer preview and in-app events remain intact.
- **AI story connection:** the Netlify function receives a **non-numeric, explicitly fictional** finance-explainer context and stores the demo intelligence version in the generated edition trace. The LLM still cannot manufacture values or write digits, percentages or prices; the financial engine owns numerical calculations.
- **Automated tests:** `tests/wealth-intelligence.test.mjs` validates the cash-flow method, synthetic fixture determinism, all twenty customer datasets, out-of-scope/malformed records, goal opt-in and the non-attribution guardrails. These run with the existing regression suite in GitHub Actions.

### Walkthrough (no new environment variables or SQL)

1. Let GitHub's main-branch changes deploy to Netlify, then sign in with the existing synthetic reviewer account.
2. Open **Customer Experience → Thomas (C012) → Weekly Investment Story → Your financial picture**.
3. Study the **illustrative** portfolio value, weekly cash-flow-adjusted return, hypothetical market proxy and return difference. Open **How was this calculated?** to see the assumptions.
4. Compare opening and closing values, cash flows, and the resulting illustrative change excluding contributions. Inspect the seven-week SVG valuation journey.
5. Explore **Explore my investments**, **Explore a goal**, and **Speak with Geojit**. These are informational mock handoffs, not active product links.
6. Switch between **Thomas** and **George**; George has an explicitly tagged fictional goal scenario. Other customers show a respectful no-declared-goal state.
7. Return to **Wealth Story Studio** to generate a new customer-first AI edition. The AI can provide a qualitative explanation of market/portfolio concepts but may not fabricate or calculate specific financial outcomes.

**No actual weekly market movements, NSE/SEBI research, NAV histories, real portfolios, holdings attribution, benchmark suitability, P&L, financial advice or customer-consent records have been integrated.** All displayed POC 2.7.2 percentages are invented fixture-derived demonstration calculations, not real or independently verified market performance. This customer-facing area is a reviewer-only synthetic simulation and should never be exposed as a live client financial dashboard.

### Next production integration priorities

1. Controlled data contracts for **client-specific historical portfolio valuations and timestamped cash flows** (equity, MF, Smartfolios, F&O and exclusions), with validated calculation service and data provenance.
2. **Approved and dated benchmark series** chosen to match portfolio composition and measurement methods; market/research feeds with publication timestamp, expiry and compliance review.
3. **Holdings-level contribution / attribution** where calculations and product coverage permit, or honest suppression of the 'why' conclusion.
4. **Goal engine** with explicit customer-entered goals, assumptions and scenario versioning—not inferred intentions.
5. Approved internal **tool handoffs** with authenticated access, customer controls, minimal data sharing and measurable useful outcomes.

## POC 2.7.1 — Geojit Wealth Story editorial intelligence

**Product rule:** A Wealth Story should help a customer understand their money better—not remind them how much Geojit knows about them.

The prior narrative displayed tool usage, transactions, RM meeting details and analyst-style third-person conclusions. POC 2.7.1 introduces a customer-first editorial structure across the server, Marketing Studio and customer preview.

### Four-layer chapter

1. **Your chapter** — one meaningful, clear and human observation; directly addresses *you*, never analyses the customer in third person.
2. **Your financial picture** — up to three dated, clearly scoped, source-verified financial figures. These are selected and formatted by deterministic application code, **not created or calculated by the LLM**.
3. **A perspective worth considering** — one piece of relevant guidance without inferring motive, risk appetite, suitability or personal financial needs.
4. **Your next step** — one optional, low-pressure educational or review action, not a product sales pitch.

The editorial logic is in `netlify/functions/lib/story-editorial.mjs`. The new prompt explicitly excludes surveillance-style phrasing (clicks, digital engagement, tracking, RM meeting details), third-person narrations and unsupported financial claims. The server rejects restricted or invented language. If evidence is too weak to justify a helpful story, it should not manufacture a milestone.

### Financial metric gate

The POC accepts only explicit numeric metric records with ALL of the following properties:
- a defined, allowlisted `metric_type` or `metric_key`;
- numeric `value`, `currency='INR'`;
- `verified=true` and `source_verified=true` on the **synthetic POC record**, not an AI assertion;
- an explicit `as_of` or `valuation_at` no more than 30 days old, and a record ID and source ID;
- `scope='geojit'` or `scope='geojit_accounts'`.

Invalid, stale, unverified and externally scoped values are omitted. The source module never sums holdings, estimates portfolio performance, infers goals or manufactures missing numbers. All such checks are *demonstration contracts*, NOT actual financial verification or production valuation rules.

### Optional fictional figures for management demo

For a more visual Thomas chapter, run the **OPTIONAL** SQL file
`supabase/migrations/20261122_005_optional_illustrative_figures.sql` in the same **synthetic-only** Supabase POC project.

It inserts four clearly tagged `DEMO_VALUATION` fixture records using `ON CONFLICT DO NOTHING`:
- Thomas (C012): fictional equity value ₹3,24,000, mutual fund value ₹2,18,000, combined fictional current value ₹5,42,000 (all as of 20 November 2026).
- George (C014): fictional mutual fund value ₹9,68,000, dated 20 November 2026.

These are **intentionally invented, internally consistent POC demonstration figures**; they do not represent a real customer or a live pricing feed. Existing source records and subscriptions are not altered. Regenerate a *new* AI edition after running the optional seed so the server can save a fresh verified-figure snapshot with its trace; previously generated editions do not change.

### Marketing review and customer preview

- Marketing Studio now shows the chapter, figures and source details, perspective and next step, plus a **customer value/privacy** review checkbox. Publication of new customer-facing content is restricted to editions generated with the 2.7.1 framework.
- The customer experience renders the same four-layer chapter and a calm **About this update** explanation rather than showing raw behavioural evidence cards or internal source record IDs.
- Older stories, even if already published in the fictional environment, remain preserved in the Studio but are **held from the updated customer preview** until they are regenerated/reviewed, avoiding continued display of the surveillance-style narrative.
- If verified figures are unavailable, no numerical value is shown; the customer still gets the helpful narrative and perspective. There is no hidden AI-estimated return or account value.
- Existing AI key, login, editorial source trace, per-edition subscriptions, dry-run delivery and explicit engagement logging remain intact.
- This release does **not** send emails, provide real customer login, add a live research feed or establish real client data access.

### POC 2.7.1 demo checklist

1. Deploy the latest GitHub code. Sign in and open **Wealth Story Studio → Story Production**.
2. For Thomas (C012), inspect the source observations and click **Generate with AI**. The new candidate should now address Thomas as *you*, have a useful perspective and avoid talking about tools, page visits and tracked RM meetings.
3. Optional: run the **005 fictional figures SQL** and regenerate Thomas to include the three illustrative valuation cards. Do not present these as true financial data.
4. Complete all four editorial review checks, mark Reviewed → Approved → Published in-app.
5. Click **Preview as customer** and open Weekly Investment Story. Verify the four-layer chapter, figure provenance, guidance and one optional next step.
6. Open **About this update**: it should explain personalisation in ordinary language, not list behavioural source IDs. Internal evidence trace remains available in Story Studio.
7. Confirm that the existing pre-2.7.1 story is preserved internally but not displayed as current customer content.
8. Test a daily trader and a service-priority scenario. The existing research/consent restrictions still apply.
9. No extra Supabase migration is needed for the editorial framework. The optional 005 SQL only supplies illustrative financial figures.

Automated CI runs `tests/story-editorial.test.mjs`, the existing OpenAI generation regression tests and the dry-run delivery eligibility tests before building.

**Before production:** replace synthetic validation flags with financial data source contracts, pricing/corporate-action rules, cross-product duplication handling, real entitlements, a controlled financial calculations service, privacy reviews and compliance-approved editorial/legal disclaimers. Financial metrics and their freshness must be governed independently of text generation.

## POC 2.7 — Customer Wealth Story Experience (fictional preview)

The internal Relationship Intelligence Lab, AI story-generation, editorial approval, subscription management and optional email dry-run are now complemented by an **actual customer-facing reading experience**, accessible only inside the authenticated reviewer POC.

### What the customer-facing preview includes

- **Premium Geojit-aligned interface:** calm editorial composition, responsive mobile/desktop layout, carefully restrained green surfaces, Radio Canada Big and accessible focus treatment. Brand asset and exact Figma component sign-off remain outstanding.
- **Reviewer-controlled persona switching:** preview any of the 20 **fictional clients**, with a clearly visible banner stating this is a *reviewer simulation* and **not** a real customer login.
- **Independent edition selection:** Daily Trading Brief, Weekly Investment Story and Monthly Wealth Journey, each with its own content rhythm and preferences.
- **Published content only:** reads `poc_story_editions` with `stage='published_in_app'`. Draft candidates, reviewed editions and approvals not yet published are never displayed as customer stories.
- **A meaningful story experience:** displays the latest published edition with its title, date, narrative and contextual note; lets the reader explore the explanation at their own pace.
- **Explainable context:** from the stored `evidence_trace` of an AI-generated story, shows only cited synthetic source observations (not raw account tables), their topic and date limitations. Older editions lacking a trace are transparently identified.
- **Guided exploration:** allows readers to explore the meaning of activity, stated goals or RM touchpoints without inventing account performance, recommendations or service actions.
- **Preferences:** independent subscribe/pause/unsubscribe controls, daily trader delivery-window preference and explicit explanation that in-app availability and optional emails are separate.
- **Engagement:** an explicit **Mark as read · demo** action records a fictional `in_app_view_demo` event in the existing Supabase event ledger, available to Wealth Story Studio. Opening the preview does not silently count as a read.

### Reviewer walkthrough for management

1. Sign in to the existing Netlify POC and open **Wealth Story Studio → Story Production**.
2. Choose **Thomas (C012) / Weekly Investment Story**. Create a candidate with OpenAI, review its source evidence, mark reviewed, tick the editorial checklist, approve and publish in-app.
3. Click **Preview as customer**. The new customer view shows Thomas's latest **published** weekly story and a source-context path.
4. Explore **What shaped it** and **Explore a little further**; confirm it does not claim external holdings, performance, goals or suitability where unknown.
5. Click **Mark as read · demo**. Return to Marketing Studio and inspect the in-app engagement count/event.
6. Open **Your preferences** and pause the weekly edition; confirm the customer can still read the published story and the optional email eligibility becomes withheld.
7. Switch to a trader such as **Vikram (C008)** and choose Daily Trading Brief. The app must show an honest empty state if no approved current brief exists, rather than inventing market calls.
8. Return to **Delivery & Engagement**: the existing email preview remains non-sending, but now provides a **Preview as customer** handoff into the authenticated fictional reading experience.

### Data and security boundary

The POC **does not provide customer authentication**, real deep links, individual row-level customer entitlements, a real outbound email provider, secure live portfolio APIs, approved external research feeds or production-grade customer consent. All customer switching and preference editing happen **under the signed-in reviewer account** using synthetic records and broad POC RLS. Never use this setup with real customer data or distribute the reviewer link as though it provides customer-only access.

**No new SQL migration or Netlify secret is required for POC 2.7.** All customer reading, subscription and engagement interactions reuse the existing synthetic `poc_story_editions`, `poc_edition_subscriptions` and `poc_studio_events` tables.

Future production scope: authenticated client deep links; a clear content-validity and customer-access layer; true customer-consent capture and event auditing; approved Geojit brand assets and mail templates; and measurable customer-value/ROI instrumentation.

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
