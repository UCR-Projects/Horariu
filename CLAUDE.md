# Horariu

University schedule generator. Students add courses with groups/time intervals, the app finds all conflict-free combinations. Monorepo: React SPA (`frontend/`) + Node.js AWS Lambda API (`backend/`).

## Monorepo

Pre-commit hooks (husky + lint-staged) run `build + test + lint` for whichever workspace has changes.

## Important Notes

- All client state is persisted to `localStorage` with `horariu-*` keys. The backend is ONLY called to generate schedules.
- The schedule generation endpoint (`POST /courses/generate`) is public (no auth required).
- Default language is Spanish (`es`), with English (`en`) as secondary.
- Time filter operates POST-generation (client-side filtering), NOT pre-generation.
