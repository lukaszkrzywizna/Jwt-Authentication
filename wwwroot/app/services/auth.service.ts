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
    }
    
    checkAccessTokenExists(): boolean {
        return !!localStorage.getItem(Configuration.tokenName) || !!sessionStorage.getItem(Configuration.tokenName);
    }

    loginIn(loginModel: LoginModel): Observable<string> {
        if (!loginModel) {
            let error = new Error("loginModel can not be null");
            Observable.throw(error);
        } else {
            let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
            let options = new RequestOptions({ headers: headers });

            let encodedLoginRequest = `email=${loginModel.username}&password=${loginModel.password}&rememberMe=${loginModel.rememberMe}`;

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
        let headers = new Headers();
        headers.append( 'Content-Type', 'application/json');
        headers.append( 'Authentication', `Bearer ${this.getToken()}`);
        let options = new RequestOptions({ headers: headers });

        return this.http
        .get(Configuration.urls.userResourceUrl)
        .catch(this.handleError);
    }

    private handleError(e: Response | any) {
        let errMsg: string;
        let errorCode: number;
        
        if (e instanceof Response) {
            const error = e.json() || '';
            errMsg = `${error.status} - ${error.statusText || ''} ${e}`;
            errorCode = error.errorCode;
        } else {
            errMsg = e.message ? e.message : e.toString();
            errorCode = 1;
        }

        console.log(`Problem during getting register request: ${errMsg}`);

        return Observable.throw(errorCode);
    }

    isLogged(): boolean {
        return this.loggedIn;
    }

    getToken(): string {
        return sessionStorage.getItem(Configuration.tokenName) || localStorage.getItem(Configuration.tokenName);
    }
}