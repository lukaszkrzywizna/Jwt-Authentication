using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace JwtAuthentication
{
    public class TokenProviderOptions
    {
        public string Path { get; set; } = JwtConfiguration.Path;

        public string Issuer { get; set; }

        public string Audience { get; set; }

        public TimeSpan Expiration { get; set; } = JwtConfiguration.Expiration;

        public SigningCredentials SigningCredentials { get; set; }

        private static TokenProviderOptions _instance;
        public static TokenProviderOptions GeTokenProviderOptions()
        {
            if (_instance == null)
            {
                var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(JwtConfiguration.SecretKey));

                _instance = new TokenProviderOptions
                {
                    Audience = JwtConfiguration.Audience,
                    Issuer = JwtConfiguration.Issuer,
                    SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256),
                };
            }

            return _instance;
        }
    }
}
