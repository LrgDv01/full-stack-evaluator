# Frontend README (React + Vite)

## 📚 Table of Contents

1. Overview
2. Prerequisites & Installation
3. Why pnpm instead of npm?
4. Project Setup & Commands
5. Tailwind CSS Setup
6. Vite Proxy & CORS Integration
7. Cleaning npm Artifacts / Switching Fully to pnpm
8. .module.css Explanation
9. Environment Variables (.env)
10. Run Frontend

---

## 1. Overview

This is the frontend of the Full-Stack Evaluator project, built using **React 18 + Vite** for high-speed development, with optional **pnpm** as the package manager and **Tailwind CSS** for styling.

---

## 2. Prerequisites & Installation

* Install **Node.js (v18+)** from [https://nodejs.org/](https://nodejs.org/)
  Verify installation:

  ```bash
  node -v
  ```
* Install **pnpm (recommended)** globally:

  ```bash
  npm install -g pnpm
  ```
* Install dependencies inside `/frontend`:

  ```bash
  cd frontend
  pnpm install
  ```

  > You can use `npm install` if preferred, but pnpm is faster and more efficient.

---

## 3. Why pnpm instead of npm?

| Feature              | pnpm                             | npm                     |
| -------------------- | -------------------------------- | ----------------------- |
| Speed                | ✅ 2–3× faster installs           | ❌ Slower                |
| Disk Usage           | ✅ Saves space via global store   | ❌ Duplicates packages   |
| Dependency Isolation | ✅ Stricter & safer               | ⚠️ Can have conflicts   |
| Monorepo Support     | ✅ Excellent (frontend + backend) | ⚠️ Requires workarounds |
| Recommended By       | Vite, modern React apps          | Default Node.js         |

**Reason for this project:** Faster setup for timed evaluation (4–5h total), better package isolation, cleaner structure.

---

## 4. Project Setup & Commands

| Command        | Description                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| `pnpm install` | Install all dependencies                                                               |
| `pnpm run dev` | Start Vite development server (default [http://localhost:5173](http://localhost:5173)) |
| `pnpm build`   | Production build                                                                       |
| `pnpm preview` | Preview production build                                                               |

---

## 5. Tailwind CSS Setup

1. Install Tailwind:

   ```bash
   pnpm add -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
2. Configure `tailwind.config.js`:

   ```js
   export default {
     content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```
3. Add Tailwind to `src/index.css` or `src/tailwind-input.css`:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

---

## 6. Vite Proxy & CORS Integration

✔ Backend URL (example): `http://localhost:5215`
✔ Frontend runs at: `http://localhost:5173`

**In `vite.config.js`:**

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

**Backend (`Program.cs`) CORS config:**

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

**✅ Why use both?**

| Feature              | Vite Proxy            | Backend CORS  |
| -------------------- | --------------------- | ------------- |
| Dev Convenience      | ✅ Yes                 | ⚠️ Not needed |
| Works Without Proxy  | ❌ No                  | ✅ Yes         |
| Production Required? | ❌ No                  | ✅ Yes         |
| Best Practice Combo  | ✅✅ Both used together |               |

---

## 7. Cleaning npm Artifacts / Switch Fully to pnpm

```bash
# Inside /frontend folder
rm -rf node_modules package-lock.json
pnpm install
```

Creates `pnpm-lock.yaml` → commit this file.

✅ Optional Commit Message:

> "Switched fully to pnpm, removed npm artifacts for consistent dependency management."

---

## 8. .module.css Explanation

`.module.css` is used because:
✔ Scopes CSS only to components that import it.
✔ Prevents global class name conflicts.
✔ Automatically generates unique class names.
✔ Recommended by React for scalable UI.

---

## 9. Environment Variables (.env)

Example `.env` file:

```env
VITE_API_BASE_URL="http://localhost:5215/api"
VITE_APP_TITLE="Task Manager App"
```

Usage in code:

```js
const api = import.meta.env.VITE_API_BASE_URL;
```

✅ .env is optional but useful for API URLs, app titles, keys, etc.

---

## 10. Run Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

Access at: `http://localhost:5173`

