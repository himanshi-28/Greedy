# LeetCode Tracker

A private-group LeetCode tracker with admin-posted daily problems, timed attempts, hybrid submission verification, leaderboards, and revision rounds.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The UI ships with demo data so it is useful before Supabase is configured. To connect Supabase, create a project, run `supabase/schema.sql`, then copy `.env.example` to `.env.local` and fill in the public URL and anon key.

## Render Deploy

This repo includes `render.yaml`. On Render, create a new Blueprint from the GitHub repository and set these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

For Google auth, add these Supabase redirect URLs:

- `https://leetcode-tracker-qliz.onrender.com/auth/callback`
- `http://localhost:3000/auth/callback`

## Product Rules

- Daily completion: `+10`.
- Finish rank bonus: `+10`, `+6`, `+3`.
- Fastest duration bonus: `+5`, `+3`, `+1`.
- Revision rounds use the same scoring but are tracked separately.
- LeetCode verification is intentionally hybrid: parse and validate accepted submission URLs where possible, otherwise mark attempts for admin review.
