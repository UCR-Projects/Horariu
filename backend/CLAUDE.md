# Backend

TypeScript, AWS Lambda (single handler), manual routing in `src/server.ts`, Drizzle ORM, PostgreSQL, Zod validation, JWT auth, bcrypt.

## Commands

```sh
npm run dev:local    # Local dev without secrets (hits src/local-server.ts)
npm run build        # tsc compile
npm run lint         # ESLint
npm run test         # Jest
```

Run a single test:
```sh
npx jest __tests__/services/ScheduleService.test.ts
```

SAM local invoke (requires Infisical + AWS SAM CLI):
```sh
npm run sam:invoke:generateSchedules
```

Database migrations (Drizzle):
```sh
npm run migrate:generate   # Generate migration
npm run migrate:migrate    # Apply migrations
npm run migrate:studio     # Open Drizzle Studio
```

## Architecture

```
Lambda handler (server.ts)
  └── Controllers (controllers/)      -- HTTP parsing, response shaping
        └── Services (services/)      -- Business logic
              └── Repositories (repositories/)  -- DB access via Drizzle ORM
```

**Key services:**
- `ScheduleService` -- Core algorithm: generates all conflict-free schedule combinations
- `CourseService` -- CRUD for courses and groups
- `UserService` -- Registration and JWT login

## Auth

JWT via AWS API Gateway Lambda Authorizer. User ID comes from `requestContext.authorizer.principalId`.

**Public routes (no auth):** `POST /register`, `POST /login`, `POST /courses/generate`

## Deployment

AWS SAM (`template.yaml`). `deploy.sh` fetches env vars from AWS SSM via Infisical and deploys. CORS allows `localhost:5173` and `horariu.com` (hardcoded in `server.ts`).

## Testing

Jest + ts-jest. Tests in `__tests__/`: schema validation tests (Zod) and ScheduleService tests (with snapshots).

## Gotchas

- Local dev uses `dev:local` which skips Infisical entirely. Use `dev` only if you have Infisical configured.
- The schedule generation endpoint is public -- no JWT required.
- Database config reads from either `DB_URI` or individual `DB_HOST/DB_USER/DB_PASSWORD/DB_NAME/DB_PORT` env vars.
