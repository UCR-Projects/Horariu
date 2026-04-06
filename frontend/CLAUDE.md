# Frontend

React 19 SPA (single route `/`), Vite 6, Zustand 5, TailwindCSS v4, Radix UI (Shadcn), Framer Motion, i18next, React Hook Form + Zod.

**Path alias:** `@` maps to `src/`

## Commands

```sh
npm run dev          # Dev server at localhost:5173
npm run build        # tsc + vite build
npm run lint         # ESLint
npm run lint:fix     # ESLint auto-fix
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
npm run test:e2e     # Playwright E2E (chromium only)
npm run test:e2e:ui  # Playwright with UI
```

Run a single test:
```sh
npx vitest run __tests__/stores/useCourseStore.test.ts
```

## State Management

All state lives in Zustand stores (`src/stores/`), each persisted to `localStorage`:

| Store | Key | Purpose |
|---|---|---|
| `useCourseStore` | `course-storage` | Courses, groups, visibility toggles |
| `useScheduleStore` | `schedule-storage` | Generated schedules, loading/error state |
| `useSavedSchedulesStore` | `horariu-saved-schedules` | Favorite schedules (content-based dedup) |
| `useScheduleFilterStore` | `horariu-schedule-filters` | Filter toggles: savedFirst, leastGaps, consecutiveClasses |
| `useTimeFilterStore` | `horariu-time-filter` | Day/hour cell selection grid (Map with custom serialization) |
| `useCourseLinkStore` | `course-link-storage` | Course linking relationships |
| `useOnboardingStore` | `horariu-onboarding` | Onboarding flow (5 steps) |
| `useScheduleViewStore` | `horariu-schedule-view` | View mode: list or carousel |
| `useTableStyleStore` | `horariu-table-style` | Table style: classic, rounded, floating, minimal, glass |
| `useCustomColorStore` | `custom-colors-storage` | Custom color palette (max 5) |

## Component Structure

- `components/courses/` -- CourseForm (Dialog desktop / Drawer mobile), CourseList, LinkCoursesDialog, LoadSampleDataButtons
- `components/schedules/` -- ScheduleTable, ScheduleCarousel, SchedulesList, ScheduleFilter, TimeFilterModal, GenerateScheduleButton, export menu
- `components/onboarding/` -- OnboardingFlow (5-step, Framer Motion animated)
- `components/sidebar/` -- AppSidebar, MobileSidebarTrigger
- `components/shared/` -- AnimatedCollapse, AnimatedList, ColorPicker, ResponsiveTooltip, EmptyState, DeleteConfirmationDialog
- `components/layout/` -- Header, ThemeToggle, LanguageToggle, InfoButton
- `components/ui/` -- Shadcn/Radix primitives (30+ components, do not edit directly)

## Home Page Flow (`src/pages/Home.tsx`)

1. No courses + onboarding not done --> `OnboardingFlow`
2. No courses + onboarding done --> `EmptyCoursesBanner`
3. Courses exist --> Full UI (sidebar + header + schedules area)

## i18n

6 namespaces: `common`, `courses`, `schedules`, `validation`, `errors`, `info`. Files in `src/locales/{en,es}/`. Default language: `es`. Default namespace: `common`.

## Testing

**Unit tests** (`__tests__/`): Vitest + jsdom + Testing Library. Coverage includes stores, services, hooks, utils, schemas. Components are NOT covered by unit tests.

**E2E tests** (`e2e/`): Playwright, chromium only. Tests: course-management, course-linking, schedule-generation, schedule-export. Playwright starts dev server automatically.

**Test setup** (`__tests__/setup.ts`): Mocks localStorage and matchMedia. Resets stores between tests.

## Key Utilities

- `src/utils/timeBlockFilter.ts` -- Filters schedules by blocked time cells (post-generation)
- `src/utils/scheduleConflicts.ts` -- Conflict detection between groups
- `src/utils/scheduleMetrics.ts` -- Gap and consecutive class calculations
- `src/utils/linkFilters.ts` -- Filters based on course link constraints
- `src/utils/constants.ts` -- TIME_RANGES (7am-10pm, 16 slots), DAYS array, SCHEDULES_PER_PAGE

## Gotchas

- `useTimeFilterStore` uses a `Map` for `selectedCells` with custom JSON serialization for localStorage persistence.
- Time filter is POST-generation: schedules are generated first, then filtered client-side. This preserves course link integrity.
- Day type uses Spanish abbreviations: `L | K | M | J | V | S | D` (K = martes to avoid collision with M = miercoles).
- Tailwind v4 uses `@tailwindcss/vite` plugin -- there is no `tailwind.config` file.
- The `components/ui/` directory contains Shadcn generated components. Do not modify them manually.
