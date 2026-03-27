# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Horariu is a university schedule generator. Students add courses with groups/time intervals and the app finds all conflict-free schedule combinations. It is a monorepo with a React SPA (`frontend/`) and a Node.js AWS Lambda API (`backend/`).

## Commands

### Frontend (`cd frontend`)

```sh
npm run dev          # Dev server at http://localhost:5173
npm run build        # tsc + vite build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
npm run test:e2e     # Playwright E2E
npm run test:e2e:ui  # Playwright with UI
```

Run a single test file:
```sh
npx vitest run __tests__/stores/useCourseStore.test.ts
```

### Backend (`cd backend`)

```sh
npm run dev:local    # Local dev without Infisical (no secrets needed)
npm run build        # tsc compile
npm run lint         # ESLint
npm run test         # Jest
```

Run a single test file:
```sh
npx jest __tests__/services/ScheduleService.test.ts
```

Invoke Lambda locally via SAM (requires Infisical + AWS SAM CLI):
```sh
npm run sam:invoke:generateSchedules
```

### Root (monorepo)

Pre-commit hooks (husky + lint-staged) run `build + test + lint` for whichever workspace has changes.

## Architecture

### Frontend

**Stack:** React 19, React Router 7 (SPA — single route `/`), Vite 6, Zustand, TanStack React Query, Radix UI, TailwindCSS v4, Framer Motion, i18next.

**Path alias:** `@` → `src/`

**State:** All application state lives in Zustand stores under `src/stores/`, each persisted to `localStorage` with a `horariu-*` key. No server state is fetched on load — courses are stored client-side; the backend is only called to generate schedules.

Key stores:
- `useCourseStore` — courses, groups, visibility toggles
- `useScheduleStore` — generated schedules, pagination, favorites
- `useOnboardingStore` — onboarding step tracking (`hasCompletedOnboarding`, `currentStep`)
- `useScheduleFilterStore` / `useTimeFilterStore` — filter/time-block state
- `useLinkedCoursesStore` — course linking relationships

**Component layout (`src/components/`):**
- `courses/` — CourseForm (Dialog on desktop, Drawer on mobile), CourseList, EmptyCoursesBanner
- `schedules/` — GenerateScheduleButton, SchedulesList, TimeFilterModal, export utilities
- `onboarding/` — OnboardingFlow (multi-step with Framer Motion)
- `sidebar/` — AppSidebar (course list; Add Course button on mobile)
- `shared/` — reusable pieces (EmptyState, DeleteConfirmationDialog, etc.)
- `ui/` — thin wrappers over Radix UI primitives

**Home page flow (`src/pages/Home.tsx`):**
1. No courses + not completed onboarding → show `OnboardingFlow`
2. No courses + onboarding done → show `EmptyCoursesBanner` (prominent CTA)
3. Courses exist → show full UI (sidebar + header with Add Course + Generate Schedules)

**i18n:** Namespaces are `common`, `courses`, `schedules`, `validation`, `errors`, `info`. Default namespace is `common`. Default language is `es` (Spanish), with `en` as the other option. Translation files live in `src/locales/{en,es}/`.

**Testing:** Unit tests in `frontend/__tests__/` (Vitest + jsdom + Testing Library). Coverage excludes components — only stores, services, hooks, utils, schemas are covered. E2E tests in `frontend/e2e/` (Playwright).

### Backend

**Stack:** TypeScript, AWS Lambda (single handler), Express-style manual routing in `src/server.ts`, Drizzle ORM, PostgreSQL, Zod validation, JWT auth, bcrypt.

**Architecture layers:**
```
Lambda handler (server.ts)
  └── Controllers (controllers/)      — HTTP parsing, response shaping
        └── Services (services/)      — Business logic
              └── Repositories (repositories/)  — DB access via Drizzle ORM
```

**Key services:**
- `ScheduleService` — core algorithm: generates all valid (conflict-free) schedule combinations from course groups
- `CourseService` — CRUD for courses and groups
- `UserService` — registration and JWT login

**Database:** Drizzle ORM with PostgreSQL. Migration commands: `npm run migrate:generate` / `migrate:migrate`. Config at `src/drizzle.config.ts`.

**Auth:** JWT via AWS API Gateway Lambda Authorizer (`requestContext.authorizer.principalId` carries the user ID). Public routes: `POST /register`, `POST /login`, `POST /courses/generate`.

**CORS:** Allowed origins are `http://localhost:5173` and `https://horariu.com` — hardcoded in `server.ts`.

**Deployment:** AWS SAM (`template.yaml`). `deploy.sh` builds, fetches env vars from AWS SSM via Infisical, and deploys. Secrets are managed with Infisical — local dev without secrets uses `dev:local` which hits `src/local-server.ts` (Express).

**Testing:** Jest + ts-jest. Tests in `backend/__tests__/`.
