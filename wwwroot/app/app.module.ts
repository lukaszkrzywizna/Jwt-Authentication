import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule  } from '@angular/forms';

import { AppComponent }   from './app.component';
import { AuthService } from './services/auth.service';
import './rxjs-extensions';

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule],
    exports: [],
    declarations: [AppComponent],
    providers: [AuthService],
    bootstrap: [AppComponent]
})
export class AppModule { }
