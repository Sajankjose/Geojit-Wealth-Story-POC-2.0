# Geojit Wealth Story — POC 2.0

A minimal, premium React + Vite foundation for the Geojit Customer Intelligence / Wealth Story proof of concept.

## Status
- Deployable frontend scaffold; no Supabase or OpenAI integration yet.
- Shows a clearly fictional 20-client scenario selector, with static illustrative context only.
- Next: model and import the validated synthetic universe into Supabase; build authenticated data access and a governed story API.
- Do **not** commit API keys or real customer data.

## Local development
```bash
npm install
npm run dev
```

## Netlify setup
Import this repository from GitHub. Framework **Vite**, build command `npm run build`, publish directory `dist`, production branch `main`. The `netlify.toml` includes the build settings and SPA fallback.

No environment variables are required for the initial deploy. Before linking Supabase, configure authentication, RLS policies, and server-side secret management. Never use a privileged Supabase key or OpenAI key in any `VITE_` variable.

**Data:** All names, profiles and information on this initial screen are fictional placeholders. The full 20-client dataset will be imported only after schema review.

## Next milestone
Supabase data schema → synthetic data import → governed customer-state views → server-side OpenAI narrative generation → Geojit design-system refinement.
