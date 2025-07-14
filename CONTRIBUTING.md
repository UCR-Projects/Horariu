# Contributing to HorariU

Thank you for your interest in contributing! Please follow these guidelines to ensure a smooth development experience for everyone.

---

## 🛡️ Required Secrets & Environment Variables

To contribute and run the project locally, you’ll need several secrets and environment variables, mostly for the backend:

- **Database credentials:**  
  - `DB_HOST`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
  - `DB_PORT`
- **JWT Secret:**  
  - `JWT_SECRET`
- **Node environment:**  
  - `NODE_ENV`
- These are typically managed in AWS SSM for deployed environments. For local development, you can use a `.env` file.

---

## 🧹 Code Style

- **Linting:**  
  We use **ESLint** for JavaScript/TypeScript code quality.
- **Tabs:**  
  Use **2 spaces** for indentation.
- **Semicolons:**  
  **Do NOT use semicolons** at the end of your statements or expressions.
- **Formatting:**  
  Please respect the existing code style. Use Prettier if available.

---

## 🧪 Quality & CI

- **Pre-commit hooks:**  
  - Every commit will run the linter (`eslint`) and all tests.
  - If there are lint or test errors, the commit will be rejected and you will **not be able to push** until resolved.

- **Continuous Integration:**  
  - Every push runs a quality workflow (GitHub Actions) to ensure all lints, tests, and checks pass in CI.
  - Your code **must** pass all checks before it can be merged.

---

## 🚦 Commit & PR Guidelines

- **Conventional Commits:**  
  - All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification (e.g., `feat: add new login page`, `fix: handle schedule conflicts`).
- **Pull Requests:**  
  - PRs must be **descriptive**. Explain what and why you changed, reference related issues if applicable.
  - Small, focused PRs are easier to review and merge.
  - All code should be reviewed before merging.

---

## 📝 How to Contribute

1. **Fork the repository** and create your branch from `main`.
2. **Install dependencies** and set up your secrets.
3. **Create your feature/fix branch** (`git checkout -b feat/my-feature`).
4. **Write code, tests, and documentation** as needed.
5. **Commit using conventional commit messages.**
6. **Push your branch** and create a descriptive pull request.
7. **Make sure all checks pass** before requesting review.
8. **Respond to feedback** and iterate as needed.

---

Thank you for helping us improve HorariU!
