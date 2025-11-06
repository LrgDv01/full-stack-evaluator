# Backend README (.NET 9 Web API)

## 📚 Table of Contents

1. Overview
2. Prerequisites & Installation
3. Database Setup (PostgreSQL)
4. Project Structure
5. Key Fixes & Improvements
6. Running the Backend
7. Testing (Swagger / JSON Example)
8. CORS Configuration
9. Future Enhancements / Notes

---

## 1. Overview

This is the backend of the Full-Stack Evaluator project, built using **.NET 9 Web API** and **Entity Framework Core**, connected to **PostgreSQL**.

---

## 2. Prerequisites & Installation

### ✅ Install Required Software

* **.NET 9 SDK** → [https://dotnet.microsoft.com/en-us/download](https://dotnet.microsoft.com/en-us/download)

  ```bash
  dotnet --version   # should output 9.x.x
  ```
* **PostgreSQL** → [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

  * Default user: `postgres`
  * Default port: `5432`
  * Remember your password

### ✅ Clone and Restore

```bash
git clone https://github.com/<your-account>/full-stack-evaluator.git
cd backend
dotnet restore
```

---

## 3. Database Setup (PostgreSQL)

Edit `appsettings.json`:

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

```
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

✔ Added `UsersController` to create users before assigning tasks
✔ Added validation attributes (`[Required]`, `[StringLength]`, etc.)
✔ Prevented null user-task relationships
✔ Added checks for existing User before creating Task
✔ Configured JSON to avoid reference cycles:

```csharp
builder.Services.AddControllers().AddJsonOptions(o =>
    o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
```

✔ Prevented returning `PasswordHash` in GET responses
✔ Added `BCrypt.Net-Next` for hashing passwords
✔ Cleaned redundant `.IsRequired()` in `OnModelCreating`

---

## 6. Running the Backend

```bash
dotnet run
```

Server runs at → [http://localhost:5215](http://localhost:5215)
Swagger available at → [http://localhost:5215/swagger](http://localhost:5215/swagger)

---

## 7. Testing (Swagger JSON Example)

Use this on `POST /api/tasks`:

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

✅ Make sure user exists before assigning tasks.

---

## 8. CORS Configuration

In `Program.cs`:

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

Why? Allows frontend (Vite port 5173) to call backend API.

---

## 9. Future Enhancements / Notes

* Use DTOs for secure data transfer
* Add authentication (JWT)
* Use `[Authorize]` for protected routes
* Seed sample data into DB for testing

