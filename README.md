# Full-Stack Evaluator — README (Root)

## DOCUMENTATION > STEPS

This section outlines the high-level steps to get the project running, and points to detailed instructions in each subfolder's README.

### 1. Fork & Clone

* Fork the repository to your GitHub account.
* Clone your fork locally:

  ```bash
  git clone https://github.com/<your-account>/full-stack-evaluator.git
  cd full-stack-evaluator
  ```
* Push initial setup / commits frequently to show progress.

### 2. Install prerequisites (high-level)

* Backend: See `backend/README.md` for full .NET 9 + PostgreSQL setup.
* Frontend: See `frontend/README.md` for Node.js + pnpm + Tailwind setup.

### 3. Run order

1. Backend first. Run migrations if needed: `dotnet ef database update`.
2. Frontend next: `pnpm run dev`.
3. Verify via Swagger and UI.

---

For detailed steps, see `/backend` and `/frontend` READMEs.
