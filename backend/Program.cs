using Microsoft.EntityFrameworkCore;
using TaskManager.Data;

DotNetEnv.Env.Load(); // Load .env file early – allows local overrides without touching (appsettings.json)

var builder = WebApplication.CreateBuilder(args);

// Enable CORS for development environment
builder.Services.AddCors(options =>
{
    // Fallback to Vite default if config missing – prevents startup crash in CI
    var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]?.Split(',') ?? new[] { "http://localhost:5173" };  // Fallback if not set
    options.AddPolicy("DevCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Allow credentials if needed; Needed for cookies / auth tokens from Vite dev server
    });
});

builder.Services.AddControllers().AddJsonOptions(opt =>
    // Ignore reference cycles (User <-> Tasks) – prevents JSON serialization exceptions
    opt.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles); // Prevent cycles in JSON serialization

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    // Npgsql provider; connection string pulled from appsettings.json (or .env override)
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))); // Adjusted the connection string from (appsettings.json) as needed

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); 
    app.UseSwaggerUI(); // Swagger UI only in dev – reduces attack surface in prod
}

app.UseHttpsRedirection();
app.UseCors("DevCorsPolicy"); // Apply CORS policy ; Must come after UseHttpsRedirection, before MapControllers
app.MapControllers();

app.Run();

