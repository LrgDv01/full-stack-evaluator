using Microsoft.EntityFrameworkCore;
using TaskManager.Data;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("DevCorsPolicy", policy =>
//     {
//         policy.WithOrigins("http://localhost:5173") // Specific to Vite port
//               .AllowAnyMethod()
//               .AllowAnyHeader();
//     });
// });

builder.Services.AddControllers();
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
app.MapControllers();
// app.UseCors("DevCorsPolicy");

app.Run();

