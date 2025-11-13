# Full-Stack Evaluator — Root README

## 🧭 Project Overview
This repository is a **monorepo** for a task management app built as a **technical exam**. It includes:

- 🖥️ **Backend:** .NET 9 Web API using **Entity Framework Core** and **PostgreSQL**
- ⚛️ **Frontend:** React (Vite + Axios)

The objective was to:
- Connect frontend and backend seamlessly
- Fix data quirks and API issues
- Implement full CRUD (Tasks & Users)
- Add modern features such as:
  - 🧩 Drag & Drop sorting
  - 🌗 Dark mode toggle (persistent)
  - ⚡ Optimistic UI updates
- Maintain clean, structured, and readable code

> ⏱️ Built in approximately **4–5 hours** with focus on clarity, structure, and commit-based documentation.

---

## 📘 DOCUMENTATION — Setup Overview
This section provides a **high-level setup guide**. Refer to `backend/README.md` and `frontend/README.md` for detailed configurations.

### 1️⃣ Fork & Clone Repository
```bash
git clone https://github.com/<your-account>/full-stack-evaluator.git
cd full-stack-evaluator
```

> 💡 Tip: Push frequent commits showing incremental progress.
```bash
git add .
git commit -m "init: setup monorepo structure"
```

---

### 2️⃣ Install Prerequisites
#### 🔧 Global Requirements
- Node.js **v18+**
- .NET **9 SDK**
- PostgreSQL **v14+**

#### ⚙️ Backend Setup
See [`backend/README.md`](../backend/README.md) for:
- EF Core packages and tools
- DB configuration (`appsettings.json`)

#### 🧩 Frontend Setup
See [`frontend/README.md`](../frontend/README.md) for:
- Node dependencies installation (`npm install`)
- Libraries: Tailwind CSS, Framer Motion, React Hot Toast

> 📝 If starting from scratch:
> ```bash
> npm init vite@latest frontend
> dotnet new webapi -o backend
> ```

---

### 3️⃣ Run Order
#### 🖥️ Backend (First)
```bash
cd backend
dotnet ef database update   # Creates database schema
dotnet run                   # Starts API server
```
Swagger available at → [http://localhost:5215/swagger](http://localhost:5215/swagger)

#### 💻 Frontend (Next)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at → [http://localhost:5173](http://localhost:5173)

#### ✅ Verify Connections
- **Swagger:** Test `/api/tasks` endpoints
- **UI:**
  - Create a user → `/users`
  - Add/sort tasks → `/tasks`
  - Check stats → Dashboard
- **Dark Mode:** Toggle in header (persists via `localStorage`)

For detailed instructions → see subfolder READMEs.

---

## 🧩 NOTES — Per Submission Guidelines

### ✅ Implemented Features
**Backend:**
- Completed CRUD for `Tasks` and `Users`
- Reorder & toggle task completion
- Added logging and validation
- Used EF Core with indexes and cascading rules
- Swagger for documentation

**Frontend:**
- Axios-based API service with interceptors
- Responsive layout with sidebar and dark mode
- **Tasks:**
  - Create/Edit/Delete modals
  - Drag & Drop sorting (`dnd-kit`)
  - Validation and optimistic updates
- **Users:**
  - Search, add, delete with validation
- **Dashboard:** Dynamic stats with Recharts
- Custom hooks for syncing data
- Toasts for user feedback

**Connections:**
- Configured proxy in `vite.config.js` for CORS
- Handled missing/partial API data gracefully

---

### ⚙️ Clarified Assumptions
| Category | Assumption |
|-----------|-------------|
| 🧑‍💻 Local Setup | Backend runs on `http://localhost:5215`, frontend on `5173` |
| 🗄️ Database | Local PostgreSQL (credentials in `appsettings.json`) |
| 🔐 Authentication | None (Open API for evaluation) |
| 🎨 Styling | Tailwind + Framer Motion (focus on clarity) |
| ⚙️ API Quirks | Missing fields handled with fallbacks |
| ⏰ Time Limit | Focused on CRUD, skipped testing/real-time |

---

### 🧱 Missing (If Any)
- JWT-based authentication (user ownership)
- Unit and e2e testing (Cypress planned)
- Pagination for large datasets
- Real-time sync (e.g., SignalR)
- Redux Toolkit (hooks used instead)

---

### 🧪 How to Test
1. **Setup:** Follow the run order above.
2. **Basic Flow:**
   - Create a user → `/users`
   - Add tasks → `/tasks`
   - Toggle completion, reorder via drag
   - Delete with confirmation
   - Toggle dark mode and refresh (check persistence)
3. **Advanced:**
   - Edit task details
   - Check Dashboard stats update
   - Simulate errors (e.g., invalid email, backend down)
4. **Database Check:**
   - Use pgAdmin to verify inserted/updated data
   - Confirm relational links (Users ↔ Tasks)

---

**📚 For more details:**
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

---

🧠 _Built with precision, clarity, and modern full-stack practices._

