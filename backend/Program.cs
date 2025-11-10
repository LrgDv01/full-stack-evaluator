using Microsoft.EntityFrameworkCore;
using TaskManager.Data;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Enable CORS for development environment
builder.Services.AddCors(options =>
{
    var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]?.Split(',') ?? new[] { "http://localhost:5173" };  // Fallback if not set
    options.AddPolicy("DevCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Allow credentials if needed
    });
});

builder.Services.AddControllers().AddJsonOptions(opt =>
    opt.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles); // Prevent cycles in JSON serialization

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))); // Adjusted the connection string from appsettings.json as needed

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); 
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("DevCorsPolicy"); // Apply CORS policy
app.MapControllers();

app.Run();

