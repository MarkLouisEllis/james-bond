# James Bond Ping Mission

A secure web application where authenticated users can send pings with random coordinates, view their ping history, and respond to pings to form a trail.

## Deployed link

https://james-bond-pings.vercel.app/

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Auth:** Clerk
- **Database:** Supabase (PostgreSQL via Drizzle ORM)
- **Styling:** Tailwind CSS + shadcn/ui
- **Testing:** Jest + React Testing Library

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- A [Clerk](https://clerk.com) account
- A [Supabase](https://supabase.com) project

## Local Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd james-bond
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable                            | Where to find it                                                  |
| ----------------------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys                                        |
| `CLERK_SECRET_KEY`                  | Clerk Dashboard → API Keys                                        |
| `DATABASE_URL`                      | Supabase → Settings → Database → Session pooler connection string |

> **Note:** Use the **Session pooler** URL from Supabase (port 5432, host `*.pooler.supabase.com`), not the direct connection. URL-encode any special characters in your password (`#` → `%23`, `+` → `%2B`).

### 3. Run database migrations

```bash
pnpm db:migrate
```

### 4. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## API Routes

| Method | Route               | Description                          |
| ------ | ------------------- | ------------------------------------ |
| `POST` | `/api/pings`        | Create a new ping                    |
| `GET`  | `/api/pings`        | Get all pings for the logged-in user |
| `GET`  | `/api/pings/latest` | Get the latest 3 pings               |
| `POST` | `/api/pings/:id`    | Reply to a ping (trail creation)     |

All routes require authentication. Unauthenticated requests return `401`.

## Running Tests

```bash
npm test
```

## Key Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint + Prettier check
npm run typecheck    # TypeScript check
npm test             # Run tests
pnpm db:generate     # Generate Drizzle migrations
pnpm db:migrate      # Apply migrations to Supabase
pnpm db:studio       # Open Drizzle Studio (database GUI)
```
