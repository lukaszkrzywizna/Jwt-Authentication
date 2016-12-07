export class Urls {
    // registerUrl = 'api/account/register';
    loginUrl = 'api/token';
    userResourceUrl = 'api/user';
    adminResourceUrl = 'api/admin';
    publicResourceUrl = 'api/public';

}

export class Configuration{
    static tokenName = 'access_token';
    static urls = new Urls();
}