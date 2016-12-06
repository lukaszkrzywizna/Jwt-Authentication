import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoginModel } from './models/login.model';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    private jwt: string;
    constructor(private authService: AuthService) { }

    ngOnInit() { 
        let loginModel = new LoginModel();
        loginModel.username = 'user';
        loginModel.password = 'user123';
        loginModel.rememberMe = false;

        this.authService.loginIn(loginModel)
        .subscribe(
            result => 
            {
                console.log("Success!!!");
                this.jwt = result;

            },
            error => console.error("Oh no!!!", error)
        )
    }

    getUserResource(){
        this.authService.getUserResource()
        .subscribe(
            result => 
            {
                console.log("Success!!!");
            },
            error => console.error("Oh no!!!", error)
        )
    }

}