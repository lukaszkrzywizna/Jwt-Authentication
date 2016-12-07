using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace JwtAuthentication
{
    public class TokenProviderMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtTokenGenerator _jwtTokenGenerator;
        private readonly TokenProviderOptions _options;

        public TokenProviderMiddleware(RequestDelegate next, JwtTokenGenerator jwtTokenGenerator)
        {
            _next = next;
            _jwtTokenGenerator = jwtTokenGenerator;
            _options = TokenProviderOptions.GetTokenProviderOptions();
        }

        public Task Invoke(HttpContext context)
        {
            // If the request path doesn't match, skip
            if (!context.Request.Path.Equals(_options.Path, StringComparison.Ordinal))
            {
                return _next(context);
            }

            // Request must be POST with Content-Type: application/x-www-form-urlencoded
            if (!context.Request.Method.Equals("POST") || !context.Request.HasFormContentType)
            {
                context.Response.StatusCode = 400;
                return context.Response.WriteAsync("Bad request");
            }


            var username = context.Request.Form["username"];
            var password = context.Request.Form["password"];

            bool rememberMe;
            var rememberMeForm = context.Request.Form["rememberMe"].FirstOrDefault();
            bool.TryParse(rememberMeForm, out rememberMe);

            return _jwtTokenGenerator.GenerateToken(context, username, password, rememberMe);
        }
    }
}
