# .NET Task Evaluator API – My Technical Exam Submission

⏰ **Estimated Time Spent So Far**: 2–3 hours (setup phase)  
🔧 **Tech Stack**:
- .NET 9 Web API  
- PostgreSQL  
- Entity Framework Core (EF Core)  
- Swagger for API documentation  

---

## 🧪 Setup Instructions

### 1. Navigate to This Folder
From my monorepo root: `cd backend`

### 2. Set up the Environment
Make sure you have the .NET 9 SDK and PostgreSQL installed. Configure your local database connection string in appsettings.json as needed (e.g., for my local setup).

### 3. Apply Database Migrations
Run the following command to create the database schema:

```bash
dotnet ef database update
```
### 4. Run the API
Run the command to Run the API 

```bash
dotnet run
```