# KickOff Kenya

Kenya's premier platform for organizing pickup football matches, building teams, booking turfs, and competing on leaderboards.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (New York style) |
| Backend / Auth / DB | Supabase (PostgreSQL + Auth + Row-Level Security) |
| Analytics | Vercel Analytics |

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Turf_Web
npm install
```

### 2. Set up environment variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

You can find these values in your Supabase project under **Project Settings → API**.

### 3. Set up the database

Run the SQL scripts **in order** in the Supabase SQL Editor
(**Dashboard → SQL Editor → New query**):

| Order | File | Purpose |
|-------|------|---------|
| 1 | `scripts/001_create_schema.sql` | Creates all tables, indexes and Row-Level Security policies |
| 2 | `scripts/002_profile_trigger.sql` | Auto-creates a profile and wallet row when a user signs up; updates player stats on rating inserts; keeps `current_players` in sync via trigger |
| 3 | `scripts/003_match_functions.sql` | Utility RPC functions — `increment_match_players`, `decrement_match_players`, `get_match_player_count` — used by the join/leave match flow |

> **Important:** Script 2 depends on tables created by Script 1, and Script 3 references the `matches` and `match_players` tables. Always run them in the order shown above.

### 4. Configure Supabase Auth

In your Supabase dashboard go to **Authentication → URL Configuration** and set:

- **Site URL**: `http://localhost:3000` (or your production URL)
- **Redirect URLs**: add `http://localhost:3000/dashboard` and `http://localhost:3000/auth/reset-password`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
.
├── app/
│   ├── auth/                    # Auth pages: login, sign-up, forgot/reset password
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── matches/             # Browse, create, join matches
│   │   ├── teams/               # Browse, create, join teams
│   │   ├── turfs/               # Browse and book turfs
│   │   ├── leaderboards/        # Player rankings
│   │   ├── profile/             # Edit your profile
│   │   ├── players/[id]/        # Public player profiles
│   │   ├── wallet/              # Wallet (coming soon)
│   │   └── settings/            # Settings (coming soon)
│   ├── not-found.tsx            # Styled 404 page
│   ├── layout.tsx               # Root layout (fonts, ThemeProvider, Analytics)
│   └── page.tsx                 # Landing page
├── components/
│   ├── dashboard/               # Header, nav, profile form and stats
│   ├── landing/                 # Hero, features, how-it-works, stats, CTA, footer
│   ├── matches/                 # Match card, search, join/leave buttons, create form
│   ├── teams/                   # Team card, search, join/leave buttons, create form
│   ├── turfs/                   # Turf booking calendar
│   └── ui/                      # shadcn/ui primitives
├── hooks/                       # useIsMobile, useToast
├── lib/
│   ├── supabase/                # Browser client, server client, middleware helper
│   ├── types.ts                 # Shared TypeScript types
│   └── utils.ts                 # cn() utility
├── scripts/                     # SQL migration scripts (run manually in Supabase)
├── .env.local.example           # Environment variable template
└── middleware.ts                # Session refresh + /dashboard route protection
```

---

## Key Features

- **Authentication** — Email/password sign-up and login via Supabase Auth. Forgot/reset password flow included.
- **Matches** — Create pickup games, set entry fees, skill level requirements and turf bookings. Players can browse, search, filter, join and leave matches.
- **Teams** — Create teams, recruit members, view team stats and match history. Team challenges supported.
- **Turfs** — Browse and book football pitches. Slot-based calendar with availability tracking.
- **Leaderboards** — Top scorers, most wins, highest rated and top assists rankings.
- **Player Profiles** — Per-player stats, career history, team memberships and achievements.
- **Wallet** — (Coming soon) M-Pesa-linked balance for entry fees and prize money.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous/public key |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Root URL of the deployed site (for auth redirects) |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | ❌ | Override auth redirect during local development |

---

## Scripts

```bash
npm run dev      # Start local dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

This project is designed to deploy on **Vercel**:

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.local` in the Vercel project settings
4. Deploy — Vercel detects Next.js automatically

Make sure to update `NEXT_PUBLIC_SITE_URL` to your production domain and add it to Supabase's allowed redirect URLs.
