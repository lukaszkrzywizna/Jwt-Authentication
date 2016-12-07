using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using JwtAuthentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

namespace JwtAuthentication
{
    public class JwtTokenGenerator
    {
        //private readonly UserManager<User> _userManager;
        private readonly TokenProviderOptions _options;

        public JwtTokenGenerator()//UserManager<User> userManager)
        {
            //_userManager = userManager;
            _options = TokenProviderOptions.GetTokenProviderOptions();
        }

        public async Task GenerateToken(HttpContext context, string username, string password, bool rememberMe = false)
        {
            var identity = await GetIdentityInMemory(username, password);//GetIdentity(username, password);
            if (identity == null)
            {
                context.Response.StatusCode = 400;
                var response = new { Description = "Invalid email or password." };
                var json = JsonConvert.SerializeObject(response);
                await context.Response.WriteAsync(json);
                return;
            }

            var now = DateTime.UtcNow;

            var dateClaim = new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(now).ToString(), ClaimValueTypes.Integer64);
            identity.AddClaim(dateClaim);


            var jwt = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: identity.Claims,
                notBefore: now,
                expires: now.Add(_options.Expiration),
                signingCredentials: _options.SigningCredentials);
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            //GetCookieJwt(encodedJwt, context, rememberMe);
            await GetJsonJwt(encodedJwt, context);
        }

        private void GetCookieJwt(string encodedJwt, HttpContext context, bool rememberMe = false)
        {
            var cookieOptions = new CookieOptions { HttpOnly = true };
            if (rememberMe)
            {
                cookieOptions.Expires = DateTime.Now + _options.Expiration;
            }

            context.Response.Cookies.Append(JwtConfiguration.TokenName, encodedJwt, cookieOptions);
        }

        private async Task GetJsonJwt(string encodedJwt, HttpContext context)
        {
            var response = new
            {
                access_token = encodedJwt,
                expires_in = (int)_options.Expiration.TotalSeconds
            };
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
        }

        private async Task<ClaimsIdentity> GetIdentityInMemory(string username, string password)
        {
            IList<Claim> claims = claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, JwtConfiguration.Subject),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            if (username == "user" && password == "user123")
            {
                var claim = new Claim(ClaimTypes.Role, "User");    
                claims.Add(claim);

                return  new ClaimsIdentity(new GenericIdentity(username, "Token"), claims);
            }
            else if (username == "admin" && password == "admin123")
            {
                var claim = new Claim(ClaimTypes.Role, "Admin");
                claims.Add(claim);

                return new ClaimsIdentity(new GenericIdentity(username, "Token"), claims);
            }

            return null;
        }

        //private async Task<ClaimsIdentity> GetIdentity(StringValues username, StringValues password)
        //{

        //    var user = await _userManager.FindByEmailAsync(username);
        //    var userValidatedPassword = await _userManager.CheckPasswordAsync(user, password);
        //    var userValidatedEmail = await _userManager.IsEmailConfirmedAsync(user);
        //    if (userValidatedPassword && userValidatedEmail)
        //    {
        //        var claims = new List<Claim>
        //        {
        //            new Claim(JwtRegisteredClaimNames.Sub, JwtConfiguration.Subject),
        //            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        //        };

        //        var roles = await _userManager.GetRolesAsync(user);

        //        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        //        return new ClaimsIdentity(new GenericIdentity(username, "Token"), claims);
        //    }

        //    return null;
        //}

        private static long ToUnixEpochDate(DateTime date) => (long)Math.Round((date.ToUniversalTime() - new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero)).TotalSeconds);
    }
}
