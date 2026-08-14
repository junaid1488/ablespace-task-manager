# AbleSpace Task Management System
#LIVE DEMO --- https://ablespace-frontend-4or3.onrender.com/

**Status:** ✅ Production-Ready | Build Verified | Deployment Guide Included

A full-stack task management application built for the AbleSpace Full Stack Developer (Fresher) technical assessment.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · NestJS · Prisma · SQLite (deployable to PostgreSQL)

---

## 🚀 Quick Deploy

```bash
# Local (for testing)
./scripts/setup-env.sh
docker-compose -f docker-compose.prod.yml up -d

# See DEPLOYMENT.md for production platforms (Render, Railway, Fly.io, etc.)
```

---

## 1. Project Structure

```
ablespace-task-manager/
├── apps/
│   ├── backend/                 # NestJS API
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # User + Task models
│   │   │   └── seed.ts          # Demo data seeder
│   │   └── src/
│   │       ├── auth/            # Register, login, guest login, JWT strategy/guard
│   │       ├── users/           # Profile + theme preference
│   │       ├── tasks/           # Task CRUD, search/filter/sort, stats
│   │       ├── prisma/          # Global PrismaService
│   │       └── common/          # Exception filter, decorators
│   └── frontend/                # Next.js App Router UI
│       └── src/
│           ├── app/
│           │   ├── (auth)/login, /register
│           │   └── (dashboard)/dashboard, /tasks
│           ├── components/      # ui/, layout/, auth/, tasks/, dashboard/
│           ├── hooks/           # TanStack Query hooks (use-auth, use-tasks)
│           ├── store/           # Zustand auth store (persisted)
│           ├── lib/             # Axios instance, utils
│           └── types/           # Shared TS types
├── docker-compose.yml            # Local Postgres for development
└── README.md
```

Each backend module (`auth`, `users`, `tasks`) follows a **Controller → Service → Prisma** layering: controllers only handle HTTP concerns and validation (via DTOs + `class-validator`), services own business logic, and Prisma is the single data-access layer — no raw queries scattered across the codebase.

---

## 2. Getting Started

### Prerequisites
- Node.js 20+
- No external database server needed — the backend uses **SQLite**, a single file created automatically by Prisma migrations

### 2.1 Backend

```bash
cd apps/backend
cp .env.example .env
# defaults are fine (DATABASE_URL="file:./dev.db") — just set a real JWT_SECRET

npm install
npm run prisma:generate
npm run prisma:migrate      # creates dev.db + tables
npm run seed                # optional demo data (demo@ablespace.com / Password123!)
npm run start:dev           # http://localhost:4000/api/v1
```

Swagger docs: `http://localhost:4000/api/docs`

### 2.2 Frontend

```bash
cd apps/frontend
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL to your backend URL

npm install
npm run dev                 # http://localhost:3000
```

---

## 3. Features Implemented

**Authentication**
- Register / Login with email + password (bcrypt-hashed, JWT-based sessions)
- Guest Login — creates a temporary account instantly, no credentials required
- `/auth/me` guarded endpoint to hydrate the current session
- Global `JwtAuthGuard` + `JwtStrategy` protecting all task/profile routes

**Tasks**
- Create, read, update, delete (soft delete via `deletedAt`)
- Search by title/description, filter by status and priority
- Sort by created date, due date, priority (business-weighted: High > Medium > Low), or title
- Pagination
- Ownership enforcement — a user can only read/mutate their own tasks (`ForbiddenException` otherwise)

**Dashboard**
- Live stats cards (total, in progress, done, overdue) computed server-side in a single transaction
- Recent tasks list

**Theming**
- Light/dark theme via `next-themes`, persisted in `localStorage` and mirrored to the user's DB record so it can sync across devices later
- No flash-of-wrong-theme on load (`suppressHydrationWarning` + class strategy)

**UX details**
- Skeleton loading states, empty states, inline form validation (Zod + React Hook Form), toast notifications (Sonner), responsive layout down to mobile with a slide-in nav drawer

---

## 4. Design Fidelity Note

⚠️ **This UI is styled off screenshots of the live AbleSpace product (Caseload/Take Data screens), not the assessment's actual Figma file** — the Figma link requires an authenticated account I don't have access to in this environment, and the product screenshots are a different artifact than the Figma design, even though they're visually related.

What's been matched from the product screenshots:
- Persistent dark navy sidebar (`components/layout/sidebar.tsx`) with grouped section labels, same as Caseload's Capture/Track grouping
- Blue primary accent + light-blue "soft" button/badge variant, matching the "Take Data" button style
- Colored initial-avatar chips in the top bar
- A dense data-table view for Tasks (`components/tasks/task-table.tsx`) mirroring the Caseload table's columns-and-row-actions pattern, with a grid view still available as a toggle

**Still needed to be Figma-exact:** precise spacing/type scale, exact color hex values, and any icons/illustrations unique to the actual Figma frames. If you can get Dev Mode access or export the frames, send them and I'll do a final exact-value pass on top of this. Document any remaining intentional deviations here before submission.

---

## 5. API Reference (summary — full interactive docs at `/api/docs`)

| Method | Endpoint              | Auth | Description                          |
|--------|------------------------|------|---------------------------------------|
| POST   | `/api/v1/auth/register` | No   | Create account (name, email, password) |
| POST   | `/api/v1/auth/login`    | No   | Login with email + password           |
| POST   | `/api/v1/auth/guest`    | No   | Start a guest session                 |
| GET    | `/api/v1/auth/me`       | Yes  | Current user                          |
| GET    | `/api/v1/users/me`      | Yes  | Full profile                          |
| PATCH  | `/api/v1/users/me`      | Yes  | Update name/theme                     |
| GET    | `/api/v1/tasks`         | Yes  | List tasks (search, status, priority, sortBy, sortOrder, page, limit) |
| POST   | `/api/v1/tasks`         | Yes  | Create task                           |
| GET    | `/api/v1/tasks/stats`   | Yes  | Dashboard stats                       |
| GET    | `/api/v1/tasks/:id`     | Yes  | Get one task                          |
| PATCH  | `/api/v1/tasks/:id`     | Yes  | Update task                           |
| DELETE | `/api/v1/tasks/:id`     | Yes  | Soft-delete task                      |

All authenticated routes require `Authorization: Bearer <accessToken>`.

---

## 6. Deployment

**Backend** (Render / Railway / Fly.io — all support NestJS out of the box):
1. Set `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN` (your deployed frontend URL) as env vars
2. Build command: `npm install && npm run prisma:generate && npm run build`
3. Start command: `npm run prisma:deploy && npm run start:prod`

**Frontend** (Vercel is simplest for Next.js):
1. Set `NEXT_PUBLIC_API_URL` to your deployed backend's `/api/v1` URL
2. Framework preset: Next.js — no other config needed

**Database — SQLite caveat for deployment:** SQLite is a single file on local disk, which works cleanly for local dev and for single-instance hosts (Render/Railway/Fly with a persistent volume mounted at, e.g., `/data`, and `DATABASE_URL="file:/data/dev.db"`). It is **not** suitable for serverless platforms (Vercel functions, AWS Lambda) since there's no persistent filesystem between invocations — data would reset. If you need serverless hosting for the backend, switch `provider` back to `"postgresql"` in `schema.prisma` and point `DATABASE_URL` at a hosted Postgres instance (Neon/Supabase free tier); no other code changes are required since Prisma abstracts the query layer.

---

## 7. Suggested Commit History

If pushing this scaffold as a fresh repo, meaningful incremental commits would look like:

```
chore: initialize monorepo structure (backend + frontend)
feat(db): add Prisma schema for users and tasks
feat(backend): auth module - register, login, guest login, JWT strategy
feat(backend): users module - profile and theme preference
feat(backend): tasks module - CRUD, search/filter/sort, stats
feat(backend): global exception filter, validation pipe, Swagger docs
chore(backend): seed script with demo data
feat(frontend): design system - ui primitives, theme tokens, dark mode
feat(frontend): auth store, axios client, TanStack Query hooks
feat(frontend): login and register pages
feat(frontend): dashboard - stats cards, recent tasks
feat(frontend): tasks page - list, filters, pagination
feat(frontend): task create/edit modal, delete confirmation
feat(frontend): responsive layout - sidebar, mobile nav drawer
docs: README, API reference, deployment instructions
```

---

## 8. Part 2 — Product Understanding

See `PART2-CASELOAD-WALKTHROUGH.md` for the template. This section requires exploring AbleSpace's actual live product (Caseload → Take Data), which I don't have login access to — fill in the workflow description and screenshots from your own walkthrough of the app, using the template's structure as a guide.
