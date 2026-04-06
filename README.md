<div align="center">

<img src="frontend/public/android-chrome-512x512.png" width="120" alt="HorariU Logo" />

# HorariU

**University schedule generator that finds every conflict-free timetable combination**

[![Deploy API](https://github.com/UCR-Projects/Horariu/actions/workflows/deploy-api.yml/badge.svg)](https://github.com/UCR-Projects/Horariu/actions/workflows/deploy-api.yml)
[![Deploy Client](https://github.com/UCR-Projects/Horariu/actions/workflows/deploy-client.yml/badge.svg)](https://github.com/UCR-Projects/Horariu/actions/workflows/deploy-client.yml)
[![API Quality](https://github.com/UCR-Projects/Horariu/actions/workflows/api-quality-check.yml/badge.svg)](https://github.com/UCR-Projects/Horariu/actions/workflows/api-quality-check.yml)
[![Client Quality](https://github.com/UCR-Projects/Horariu/actions/workflows/client-quality-check.yml/badge.svg)](https://github.com/UCR-Projects/Horariu/actions/workflows/client-quality-check.yml)

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-087EA4?style=for-the-badge&logo=react)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-EAB308?style=for-the-badge)](./LICENSE)

[**Live App**](https://horariu.com) · [**Report Bug**](https://github.com/UCR-Projects/Horariu/issues) · [**Request Feature**](https://github.com/UCR-Projects/Horariu/issues)

<a href="https://deepwiki.com/UCR-Projects/Horariu">
  <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki" />
</a>

</div>

## What is Horariu?

Horariu is a full-stack web app that generates every possible conflict-free university schedule. Students select their courses and groups, and the app instantly calculates all viable timetable combinations — making course registration planning effortless.

Built for university students in Costa Rica — **UCR, TEC, UNA, UNED, and private universities**.

## Features

**Schedule Generation**
- Automatic generation of all conflict-free timetable combinations
- Course linking — lock groups across related courses so they're always paired together
- Hide individual courses or groups to exclude them from generation

**Filtering & Organization**
- Interactive time filter — block specific day/hour cells to exclude unwanted time slots
- Smart filters — sort by fewest gaps, consecutive classes, or saved-first
- Save favorite schedules for quick comparison
- Schedule pagination with list and carousel views

**Customization**
- Five table styles — classic, rounded, floating, minimal, glass
- Custom color palette per course with HEX input support
- Light and dark mode
- English and Spanish support

**Export & Sharing**
- Download schedules as images (PNG) or PDF
- Mobile-friendly responsive design

**Onboarding**
- Guided 5-step walkthrough for first-time users
- Sample data loading to explore the app instantly


## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 · TypeScript · Vite 6 · Zustand · TailwindCSS v4 · Radix UI · Framer Motion · i18next |
| **Backend** | Node.js · TypeScript · AWS Lambda · Drizzle ORM · PostgreSQL · Zod · JWT |
| **Infrastructure** | AWS API Gateway · AWS SAM · Cloudflare |
| **CI/CD** | GitHub Actions (lint + test + build + deploy) |
| **Testing** | Vitest · Playwright · Jest |

## Getting Started

**Requirements:** Node.js 18+, npm

### Frontend

```sh
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Backend

```sh
cd backend
npm install
npm run dev:local    # No secrets or AWS config needed
```

> [!NOTE]
> `dev:local` runs a local Express server without Infisical or AWS dependencies — ideal for frontend development and testing the schedule generation endpoint.

For full deployment with AWS SAM and Infisical, see the backend [deploy script](./backend/deploy.sh).


## Project Structure

```
horariu/
├── frontend/              # React SPA
│   ├── src/
│   │   ├── components/    # UI components (courses, schedules, onboarding, shared)
│   │   ├── stores/        # Zustand state management (persisted to localStorage)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API client
│   │   ├── utils/         # Schedule logic, filters, color utilities
│   │   ├── validation/    # Zod schemas
│   │   └── locales/       # i18n translations (en, es)
│   ├── __tests__/         # Vitest unit tests
│   └── e2e/               # Playwright E2E tests
├── backend/               # AWS Lambda API
│   ├── src/
│   │   ├── controllers/   # HTTP request handling
│   │   ├── services/      # Business logic (schedule algorithm)
│   │   ├── repositories/  # Database access (Drizzle ORM)
│   │   └── schemas/       # Zod validation
│   └── __tests__/         # Jest unit tests
└── .github/workflows/     # CI/CD pipelines
```


## Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation.

1. **Fork** the repository
2. **Create a branch** for your feature or fix:
   ```sh
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and test them — pre-commit hooks will run `build + test + lint` automatically
4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```sh
   git commit -m "feat: add support for weekend schedules"
   ```
5. **Open a Pull Request** with a clear description

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).


## Contributors
 
<a href="https://github.com/gqbo">
  <img src="https://github.com/gqbo.png" width="80" height="80" style="border-radius:50%" alt="gqbo" />
</a>
<a href="https://github.com/JGeanca">
  <img src="https://github.com/JGeanca.png" width="80" height="80" style="border-radius:50%" alt="JGeanca" />
</a>


## License

This project is licensed under the terms of the [LICENSE](LICENSE) file. Please see the LICENSE file for more details about permissions and limitations.
