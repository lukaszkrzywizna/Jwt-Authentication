import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../configuration/configuration';
import { LoginModel } from '../models/login.model';

@Injectable()
export class AuthService {

    private loggedIn = false;

    constructor(
        private http: Http) {
        this.loggedIn = this.checkAccessTokenExists();
        this.logOut();
    }
    
    checkAccessTokenExists(): boolean {
        return !!localStorage.getItem(Configuration.tokenName) || !!sessionStorage.getItem(Configuration.tokenName);
    }

    loginIn(loginModel: LoginModel): Observable<string> {
        if (!loginModel) {
            let error = new Error('loginModel can not be null');
            Observable.throw(error);
        } else {
            let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
            let options = new RequestOptions({ headers: headers });

            let encodedLoginRequest = `username=${loginModel.username}&password=${loginModel.password}&rememberMe=${loginModel.rememberMe}`;

            return this.http
                .post(Configuration.urls.loginUrl, encodedLoginRequest, options)
                .map(x => x.json())
                .map(x => {
                    if (loginModel.rememberMe) {
                        localStorage.setItem(Configuration.tokenName, x.access_token);
                    } else {
                        sessionStorage.setItem(Configuration.tokenName, x.access_token);
                    }
                    this.loggedIn = true;
                    return x.access_token;
                })
                .catch(e => this.handleError(e));
        }
    }

     logOut(): void {
        sessionStorage.removeItem(Configuration.tokenName);
        localStorage.removeItem(Configuration.tokenName);
    }

    getUserResource(): Observable<Response> {
        return this.bearerRequest(Configuration.urls.userResourceUrl);
     }

    getAdminResource(): Observable<Response> {
        return this.bearerRequest(Configuration.urls.adminResourceUrl);
    }

    getPublicResource(): Observable<Response> {
        return this.http
            .get(Configuration.urls.publicResourceUrl)
            .catch(this.handleError);
    }

    private bearerRequest(url: string): Observable<Response>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.getToken()}`);
        let options = new RequestOptions({ headers: headers });

        return this.http
            .get(url, options)
            .catch(this.handleError);
    }

    private handleError(e: Response | any) {
        console.log(`Problem during getting register request: ${e}`);

        return Observable.throw(new Error(`Status: ${e.status} StatusText: ${e.statusText}`));
    }

    isLogged(): boolean {
        return this.loggedIn;
    }

    getToken(): string {
        return sessionStorage.getItem(Configuration.tokenName) || localStorage.getItem(Configuration.tokenName);
    }
}