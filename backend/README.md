# .NET Task Evaluator API – Technical Exam Submission

⏰ **Estimated Time Spent**: 2–3 hours  
🔧 **Tech Stack**:
- .NET 9 Web API  
- PostgreSQL  
- Entity Framework Core (EF Core)  
- Swagger for API documentation  

---

## 🧪 Setup Instructions

### 1. Navigate to this folder

Assuming you're in the monorepo root, `cd backend` (or your folder name).

### 2. Set up the environment
Ensure .NET 9 SDK and PostgreSQL are installed. Update the database connection string in `appsettings.json` if needed (e.g., for your local Postgres instance).

### 3. Apply database migrations
Run this to create/update the schema:

```bash
dotnet ef database update