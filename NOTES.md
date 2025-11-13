# Full-Stack Evaluator — Notes

## 📘 What I Implemented
- **Backend**: Implemented `Tasks` and `Users` controllers with logging, validation (e.g., checking if user exists), and entity mappings. Added EF Core configurations including indexes and cascade rules. Integrated Vite proxy for seamless backend-frontend communication.
- **Frontend**: Built modular React components with responsive layout and sidebar. Integrated **Axios** services with an error interceptor for reliable API calls. Implemented **dark mode** with `localStorage` persistence. Created **task features** (DnD sorting, modals for details/edit/delete, optimistic CRUD) and **user management** (forms, validation, search, delete). Added dashboard with statistics and charts.
- **Connections**: Proxy setup in Vite for `/api` routing to backend. Handled errors and displayed user feedback via toasts. Used React hooks for local state (tasks/users).
- **Extras**: Added inline comments for reasoning, toasts for feedback, and animations using **Framer Motion** for better UX polish.

---

## ⚠️ What’s Missing (If Any)
- **Authentication / Access Control** — e.g., JWT for user-task ownership and secure API access.
- **Testing** — unit tests for React hooks and e2e tests for full flows.
- **Pagination / Real-Time Updates** — missing advanced features like `SignalR` for real-time sync.
- **Redux Integration** — commented in code but replaced by simpler local state hooks for the exam’s time scope.

---

## 🧪 How to Test Changes
1. **Backend**:
   ```bash
   cd backend
   dotnet ef database update
   dotnet run
   ```
   Open **Swagger** at [http://localhost:5215/swagger](http://localhost:5215/swagger). Test endpoints such as `POST /api/users` and `GET /api/tasks`.

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Visit the app at [http://localhost:5173](http://localhost:5173).

   Perform actions:
   - Add a user (on **Users** page)
   - Create/sort tasks (on **Tasks** page)
   - Toggle **Dark Mode** (persistent via localStorage)
   - Check **Dashboard** statistics and charts

3. **Full Integration**:
   - Add a task for a user, then delete — confirm toasts and database updates (inspect via **pgAdmin** for PostgreSQL).
   - Test responsiveness by resizing the browser.
   - Try searching/filtering in **Tasks** and **Users** pages.

---

💡 **Tip:** Commit history reflects incremental progress with clear reasoning in commit messages — demonstrating structured problem-solving and adherence to evaluation guidelines.

