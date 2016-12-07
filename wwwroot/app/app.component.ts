import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoginModel } from './models/login.model';
import { Resources } from './resources/resources';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent {
    private hideLoginErrorResponse = true;
    private loginResponse: string;
    private userResponse: string;
    private adminResponse: string;
    private publicResponse: string;


    private jwt: string;
    private resources = new Resources();
    constructor(private authService: AuthService) { }

    private loginModel = new LoginModel();

    loginRequest() {
        this.authService.loginIn(this.loginModel)
            .subscribe(
            result => {
                console.log('Success!!!');
                this.hideLoginErrorResponse = true;
                this.loginResponse = "";
                this.jwt = result;

            },
            error => this.processLoginErrorCode(error)
            );
    }

    processLoginErrorCode(errorCode: any): void {
        this.hideLoginErrorResponse = false;
        this.loginResponse = this.resources.invalidusernameOrPassword;
        this.jwt = "";
        this.authService.logOut();
    }

    getUserResource() {
        this.userResponse = "";
        this.authService.getUserResource()
            .subscribe(
            result => {
                this.userResponse = `Status: ${result.status}, StatusText: ${result.statusText}`;
                console.log('Success!!!');
            },
            error => {
                console.error('Oh no!!!', error)
                this.userResponse = error.message;
            });
    }

    getAdminResource() {
        this.adminResponse = "";
        this.authService.getAdminResource()
            .subscribe(
            result => {
                this.adminResponse = `Status: ${result.status}, StatusText: ${result.statusText}`;
                console.log('Success!!!');
            },
            error => {
                console.error('Oh no!!!', error)
                this.adminResponse = error.message;
            });
    }

    getPublicResource() {
        this.publicResponse = "";
        this.authService.getPublicResource()
            .subscribe(
            result => {
                this.publicResponse = `Status: ${result.status}, StatusText: ${result.statusText}`;
                console.log('Success!!!');
            },
            error => {
                console.error('Oh no!!!', error)
                this.publicResponse = error.message;
            });
    }
}