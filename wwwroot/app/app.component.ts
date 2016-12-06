import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoginModel } from './models/login.model';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    private jwt: string;
    constructor(private authService: AuthService) { }

    private loginModel: LoginModel;

    loginToService() {
        this.authService.loginIn(this.loginModel)
            .subscribe(
            result => {
                console.log('Success!!!');
                this.jwt = result;

            },
            error => console.error('Oh no!!!', error)
            );
    }

    getUserResource() {
        this.authService.getUserResource()
            .subscribe(
                result => {
                    console.log('Success!!!');
                },
                error => console.error('Oh no!!!', error)
            );
    }

    getAdminResource() {
        this.authService.getUserResource()
            .subscribe(
            result => {
                console.log('Success!!!');
            },
            error => console.error('Oh no!!!', error)
            );
    }

}