using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtAuthentication
{
    public class JwtConfiguration
    {
        /// <summary>
        /// Our invisible secret :)
        /// </summary>
        public static readonly string SecretKey = "thisIsMyVerySecretPassword";
        public static readonly string Issuer = "AuthenticationServer";
        public static readonly string Audience = "WeBBMeetUp";
        public static readonly string Subject = "AuthLesson";

        public static readonly string AuthenticationScheme = "Cookie";
        public static readonly string TokenName = "access_token";
        public static readonly string Path = "/api/token";
        public static readonly TimeSpan Expiration = TimeSpan.FromDays(7);
    }
}
