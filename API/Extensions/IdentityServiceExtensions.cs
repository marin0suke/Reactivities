using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services,
            IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt => 
            {
                opt.Password.RequireNonAlphanumeric = false;
                opt.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<DataContext>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt => 
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false, 
                        ValidateAudience = false
                    };
                    opt.Events = new JwtBearerEvents // 214. authenticating to signalr
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"]; // spelling imp. client side will pass token in query string. needs to be this.
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                            {
                                context.Token = accessToken; // now will have access to this token inside our hub context.
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

                // 214. adding signalR auth: will allow us to get token from our query string that we send up with our signal. match it to the end points, and add to context if matches. essentially auths in thie way.


            services.AddAuthorization(opt => 
            {
                opt.AddPolicy("IsActivityHost", policy => 
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            }); // 165. configure host auth with identity.
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>(); // 165. Transient since we only need this to work while the method is running.
            services.AddScoped<TokenService>();

            return services;
        }
    }
}

//130. config identity in start up class
//136. authenticating to the app - need another package dl - authenticate jwt bearer token . from nuget
// now have sorted authentication service but need to add middleware as well. 
//137. storing secrets in dev - changed from hard coded key to get from config instead. specified TokenKey. 