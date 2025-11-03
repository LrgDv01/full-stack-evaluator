# 🧪 Full-Stack Evaluator – Technical Exam Submission

Welcome to my technical evaluation submission!

This monorepo contains both the **backend (.NET 9 Web API)** and **frontend (React)** projects. I've started building and fixing key parts of this intentionally incomplete system, addressing quirks as I go and thinking like a dev in real-world scenarios.

---

## ⏱️ Time Limit

**4 to 5 hours**  
I'm treating this as a timed test, focusing on core setup without overthinking yet.

---

## 🎯 Objectives

- ✅ Connect frontend to the existing API (in progress)
- 🔧 Implement or complete missing backend logic (starting with setup)
- 🔄 Handle real-world scenarios (partial data, errors, state)
- 💅 Code should be clean, structured, and readable
- 📦 Commit regularly — **no one big fat commit**

---

## 📦 Stack Overview

### Backend

- .NET 9 Web API
- Entity Framework Core
- PostgreSQL
- Swagger docs

### Frontend

- React + Axios
- Redux Toolkit (if I add it later)
- Vite (dev server)
- Styled with Tailwind CSS (my choice for simplicity)

---

## ✅ Submission Write-Up
- **What I've Implemented So Far**: Initialized the monorepo structure with /backend and /frontend folders. Added personalized READMEs to document the project. Set up commit guidelines based on our discussions about showing incremental progress.
- **What’s Missing (If Any)**: Actual code implementation—next steps include cloning the original backend repo, applying migrations, and connecting the frontend via Axios. I'll handle API quirks like incomplete endpoints as I discover them.
- **How to Test My Changes**: 
  1. Clone my repo: `git clone https://github.com/LrgDv01/full-stack-evaluator.git`
  2. Navigate to /backend, install .NET 9 SDK and PostgreSQL, then run `dotnet ef database update` and `dotnet run`.
  3. Navigate to /frontend, run `pnpm install` and `pnpm run dev`.
  4. Check Swagger for API (once running) and frontend for basic connections.

Good luck reviewing my work. I'm building smart and coding loud! 💻🔥