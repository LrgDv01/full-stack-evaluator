# 🧪 React Task Evaluator Frontend – My Submission

⏰ **Estimated Time Spent So Far**: 1-2 hours (planning phase)  
🔧 **Tech Stack**:
- [React 18+](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
- My choice: Tailwind CSS for quick styling (logic over looks, as emphasized)

## 🎯 Objectives

- ✅ Connect to a RESTful API (with some "quirks") – see my backend: [Full-Stack Evaluator Backend](https://github.com/LrgDv01/full-stack-evaluator/tree/main/backend)
- 🛠️ Implement features with partial or ambiguous requirements (planning to add task views)
- ⚠️ Identify places where API usage is unsafe or incomplete (will fix as I connect)
- 🧠 Show thought process via commits, comments, or UI choices  
- 📦 Handle API failures gracefully (e.g., loading states from our past React talks)
- 🚀 Add features I think are missing, like basic error modals

### 📦 Guidelines Followed

- This isn't about pixel-perfect UI. Logic > Looks.
- **Commit often** so reviewers can follow my thought process (like in our commit message discussions).
- I'll leave `TODO` or `FIXME` comments if something’s unclear or unfinished.
- I'm free to use libs—just being transparent (e.g., might add React Router if needed).
- Assumptions: API runs locally; I'll clarify in commits if quirks arise, like incomplete data handling.

### Setup Instructions
1. Navigate to this folder from the monorepo root: `cd frontend`
2. Using `pnpm` instead of `npm` for frontend package management for faster installs and efficiency. Fallback to `npm` if needed.
3. Install dependencies: `pnpm install`
4. Run the dev server: `pnpm run dev`
5. The app will be available at http://localhost:5173 – ensure the backend is running for API calls.
6. Using `pnpm` for all frontend installs to optimize speed; removed `npm` artifacts.