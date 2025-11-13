# Frontend README (React + Vite)

---

## 📘 Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites & Installation](#2-prerequisites--installation)
3. [Why pnpm Instead of npm?](#3-why-pnpm-instead-of-npm)
4. [Project Setup & Commands](#4-project-setup--commands)
5. [Tailwind CSS Setup](#5-tailwind-css-setup)
6. [Vite Proxy & CORS Integration](#6-vite-proxy--cors-integration)
7. [Cleaning npm Artifacts / Switching Fully to pnpm](#7-cleaning-npm-artifacts--switching-fully-to-pnpm)
8. [.module.css Explanation](#8-modulecss-explanation)
9. [Environment Variables (.env)](#9-environment-variables-env)
10. [Run Frontend](#10-run-frontend)
11. [Submission Notes (Per Exam Guidelines)](#11-submission-notes-per-exam-guidelines)

---

## 1. Overview

The **frontend** of the **Full-Stack Evaluator** project is built with **React 18 + Vite** for high-speed development. It uses **pnpm** for efficient dependency management and **Tailwind CSS** for rapid, responsive styling.

---

## 2. Prerequisites & Installation

### ✅ Install Node.js (v18+)

[Download Node.js](https://nodejs.org/)

```bash
node -v  # verify version
```

### 🧩 Install pnpm (Recommended)

```bash
npm install -g pnpm
```

### 📦 Install Dependencies

```bash
cd frontend
pnpm install
```

> You can use `npm install` if preferred, but `pnpm` is **faster and more space-efficient**.

---

## 3. Why pnpm Instead of npm?

| Feature | pnpm | npm |
|----------|------|-----|
| Speed | ✅ 2–3× faster installs | ❌ Slower |
| Disk Usage | ✅ Global store saves space | ❌ Duplicates packages |
| Dependency Isolation | ✅ Safer & stricter | ⚠️ Potential conflicts |
| Monorepo Support | ✅ Excellent (frontend + backend) | ⚠️ Requires tweaks |
| Recommended By | Vite, modern React apps | Default Node.js |

> **Reason:** Faster setup for timed evaluation (4–5 hours total) and cleaner dependency management.

---

## 4. Project Setup & Commands

| Command | Description |
|----------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm run dev` | Start Vite dev server (default: [http://localhost:5173](http://localhost:5173)) |
| `pnpm run build` | Build for production |
| `pnpm run preview` | Preview production build |

---

## 5. Tailwind CSS Setup

### 1️⃣ Install Tailwind

```bash
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2️⃣ Configure `tailwind.config.js`

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3️⃣ Add to CSS Entry File

In `src/index.css` or `src/tailwind-input.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 6. Vite Proxy & CORS Integration

- **Backend:** http://localhost:5215  
- **Frontend:** http://localhost:5173

### ⚙️ vite.config.js

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5215',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

### 🧱 Backend (Program.cs)

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();
app.UseCors("AllowLocalhost");
```

### ✅ Why Use Both?

| Feature | Vite Proxy | Backend CORS |
|----------|-------------|--------------|
| Dev Convenience | ✅ Yes | ⚠️ Not needed |
| Works Without Proxy | ❌ No | ✅ Yes |
| Needed in Production | ❌ No | ✅ Yes |
| Best Practice | ✅✅ Use both |

---

## 7. Cleaning npm Artifacts / Switching Fully to pnpm

```bash
rm -rf node_modules package-lock.json
pnpm install
```

> Creates `pnpm-lock.yaml` — commit this file.

**Optional Commit Message:**
```
Switched fully to pnpm, removed npm artifacts for consistent dependency management.
```

---

## 8. .module.css Explanation

`.module.css` files:
- ✅ Scope CSS only to the importing component
- ✅ Prevent global class conflicts
- ✅ Auto-generate unique class names
- ✅ Recommended by React for scalable UI architecture

---

## 9. Environment Variables (.env)

### 📄 Example `.env` File

```env
VITE_API_BASE_URL="http://localhost:5215/api"
VITE_APP_TITLE="Task Manager App"
```

### 💻 Usage in Code

```js
const api = import.meta.env.VITE_API_BASE_URL;
```

> `.env` is optional but helpful for configuring API URLs, titles, and environment-based settings.

---

## 10. Run Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

Access the app at → [http://localhost:5173](http://localhost:5173)

---

## 11. Submission Notes (Per Exam Guidelines)

### 🧾 Short Write-Up

The frontend connects to the backend API via **Axios** using a **Vite proxy** to bypass CORS issues. Focus areas included task CRUD, drag-and-drop sorting, user management, and UI responsiveness with dark mode and toasts.

Structure:
- **Hooks:** Local state (optimistic updates)
- **Components:** Reusable modals, forms, and lists
- **UI:** Tailwind + animations (Framer Motion)

> Prioritized functionality and clarity under time constraints.

### 📌 Clarified Assumptions

- **API:** Backend runs at `http://localhost:5215/api`; proxy + `.env` handle routing.
- **Styling:** Tailwind for rapid UI; additional libs like `dnd-kit`, `framer-motion`, `react-hot-toast`.
- **State Management:** Local hooks instead of Redux for simplicity.
- **Responsiveness:** Mobile-first design with dark mode persistence.
- **Time:** Focused on CRUD, validations, and API integration (skipped tests/auth).

### 🛠️ What Was Implemented

- **API Services:** Axios client + interceptors
- **UI Components:** Sidebar, header, modals, forms, task/user lists
- **Hooks:** useDarkMode, useTaskManagement, useUsers
- **Pages:** Dashboard (charts), Tasks, Users
- **Extras:** Toasts, loaders, animations

### ⚠️ What’s Missing

- Authentication (JWT/login)
- Tests (Jest/React Testing Library)
- Pagination / infinite scroll
- Real-time updates (WebSockets)
- Advanced theming / Redux integration

### 🧪 How to Test

1. **Setup & Run:** Follow [Sections 2](#2-prerequisites--installation) and [10](#10-run-frontend)
2. **Basic:** Create users and tasks, toggle task completion, edit, delete, reorder via DnD
3. **Advanced:** Dark mode persistence, dashboard updates, validation & toast handling
4. **Edge Cases:** Invalid data → validation errors; stop backend → API error handled
5. **Verification:** Inspect Network tab for `/api` calls and confirm DB changes via pgAdmin

