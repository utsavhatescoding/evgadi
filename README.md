# EV Match Nepal

Nepal-focused EV discovery, matching and dealer-enquiry platform.

## Run locally

1. Install Node.js 22.
2. Copy `.env.example` to `.env`.
3. Add your Supabase project URL and public anon key.
4. Run:

```bash
npm install
npm run dev
```

## Supabase

For a new project, run:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

For the existing earlier EV Match database, run:

1. `supabase/upgrade-v3.sql`
2. `supabase/seed.sql`

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Deploy through GitHub import or upload the ZIP to Netlify.
