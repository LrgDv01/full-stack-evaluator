# Backend README (.NET 9 Web API)

---

## 📘 Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites & Installation](#2-prerequisites--installation)
3. [Database Setup (PostgreSQL)](#3-database-setup-postgresql)
4. [Project Structure](#4-project-structure)
5. [Key Fixes & Improvements](#5-key-fixes--improvements)
6. [Running the Backend](#6-running-the-backend)
7. [Testing (Swagger / JSON Example)](#7-testing-swagger--json-example)
8. [CORS Configuration](#8-cors-configuration)
9. [Future Enhancements / Notes](#9-future-enhancements--notes)
10. [Submission Notes (Per Exam Guidelines)](#10-submission-notes-per-exam-guidelines)

---

## 1. Overview

The **backend** of the **Full-Stack Evaluator** project is built using **.NET 9 Web API** and **Entity Framework Core**, connected to a **PostgreSQL** database.

---

## 2. Prerequisites & Installation

### ✅ Required Software

- **.NET 9 SDK** → [Download here](https://dotnet.microsoft.com/en-us/download)

  ```bash
  dotnet --version   # should output 9.x.x
  ```

- **PostgreSQL** → [Download here](https://www.postgresql.org/download/)
  - Default user: `postgres`
  - Default port: `5432`
  - Remember your password

### ⚙️ Clone & Restore

```bash
git clone https://github.com/<your-account>/full-stack-evaluator.git
cd backend
dotnet restore
```

---

## 3. Database Setup (PostgreSQL)

Edit **appsettings.json**:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=TaskDb;Username=postgres;Password=yourpassword"
}
```

Run EF Core migrations:

```bash
dotnet ef database update
```

---

## 4. Project Structure

```bash
backend/
├── Controllers/
│   ├── TasksController.cs
│   └── UsersController.cs  ✅ (added)
├── Models/
│   ├── User.cs
│   └── TaskItem.cs
├── Data/
│   └── ApplicationDbContext.cs
└── Program.cs
```

---

## 5. Key Fixes & Improvements

- ✅ Added `UsersController` to create users before assigning tasks
- ✅ Added validation attributes (`[Required]`, `[StringLength]`, etc.)
- ✅ Prevented null user-task relationships
- ✅ Added user existence checks before creating tasks
- ✅ Configured JSON to avoid reference cycles:

  ```csharp
  builder.Services.AddControllers().AddJsonOptions(o =>
      o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
  ```

- ✅ Excluded `PasswordHash` from GET responses
- ✅ Integrated `BCrypt.Net-Next` for password hashing
- ✅ Removed redundant `.IsRequired()` calls in `OnModelCreating`

---

## 6. Running the Backend

```bash
dotnet run
```

- Server runs at → [http://localhost:5215](http://localhost:5215)
- Swagger UI → [http://localhost:5215/swagger](http://localhost:5215/swagger)

---

## 7. Testing (Swagger / JSON Example)

Use this JSON for `POST /api/tasks`:

```json
{
  "title": "Plant Trees",
  "isDone": false,
  "userId": 1,
  "user": {
    "email": "john@example.com",
    "passwordHash": "1234"
  }
}
```

> ⚠️ Ensure a user exists before assigning a task.

---

## 8. CORS Configuration

In **Program.cs**:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithOrigins("http://localhost:5173"));
});

app.UseCors("AllowFrontend");
```

> 💡 Allows the frontend (Vite port 5173) to access backend APIs.

---

## 9. Future Enhancements / Notes

- Use **DTOs** for secure data transfer
- Add **JWT authentication**
- Protect routes using `[Authorize]`
- Add **data seeding** for testing

---

## 10. Submission Notes (Per Exam Guidelines)

### 🧾 Short Write-Up

The backend provides a RESTful API for managing **Tasks** and **Users**, focusing on CRUD operations, validation, and PostgreSQL integration using EF Core. Missing user checks and schema issues were fixed incrementally with descriptive commits.

The codebase is clean and scalable, featuring:
- Proper DTO mapping and validation
- Logging for debugging
- CORS configuration for frontend connection
- Password hashing for user security

### 📌 Clarified Assumptions

- **Database:** Local PostgreSQL with default credentials; `appsettings.json` should be updated for production.
- **API Rules:** Tasks require users (validation enforced); no authentication yet (open endpoints).
- **EF Core:** Cascade delete enabled for tasks when deleting users.
- **Performance:** Designed for small datasets (no caching/pagination yet).
- **Error Handling:** Includes checks for invalid user references and logs for debugging.

### 🛠️ What Was Implemented

- **Controllers:** `TasksController` & `UsersController` (CRUD + validation + hashing)
- **Models/DTOs:** Validation attributes and secure data responses
- **DbContext:** Cascade deletes, unique email constraint
- **Program.cs:** Configured CORS, JSON options, and environment overrides
- **Improvements:** Prevented orphan records and allowed partial updates

### ⚠️ What’s Missing

- Authentication (JWT, `[Authorize]`)
- Unit & integration tests
- Database seeding
- Pagination/sorting for large data sets
- Advanced logging (Serilog)

### 🧪 How to Test

1. **Setup/Run:** Follow Sections 2–6 → `dotnet restore`, `dotnet ef update`, `dotnet run`
2. **Basic:**
   - `POST /api/users` → create a user
   - `POST /api/tasks` → create task with valid `userId`
   - `GET /api/tasks?userId=1` → filter by user
3. **Edge Cases:**
   - Duplicate email → returns `BadRequest`
   - Invalid `UserId` → returns error
   - Missing required fields → validation fails
4. **Delete User:**
   - `DELETE /api/users/{id}` → cascades tasks (verify in pgAdmin)
5. **Frontend Test:**
   - Ensure no CORS issues from `http://localhost:5173`

