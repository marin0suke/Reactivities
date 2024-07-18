using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials() // 216. will resolve issue with connecting to client hub. signalR requires explicit allowing of sending up credentials (unlike API autho headers)
                        .WithOrigins("http://localhost:3000"); // NOTE:: changed this to 5000 to match API things.. might need to change this back. 
                });
            });
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Create>();
            services.AddHttpContextAccessor(); // 158. added to allow access inside Infrastructure proj.
            services.AddScoped<IUserAccessor, UserAccessor>(); // 158. will make these avaiable to be injected inside our application handlers. 
            services.AddScoped<IPhotoAccessor, PhotoAccessor>(); // 180. adding cloudinary interfaces.
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary")); // 179. adding cloudinary.
            services.AddSignalR(); // 213 adding a signalR hub.

            
            return services;
        }
    }
}

