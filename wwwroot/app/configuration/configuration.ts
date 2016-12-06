export class Urls {
    // registerUrl = 'api/account/register';
    loginUrl = 'api/token';
    userResourceUrl = 'api/values/5';
}

export class Configuration{
    static tokenName = 'access_token';
    static urls = new Urls();
}