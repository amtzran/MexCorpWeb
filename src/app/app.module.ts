import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from "./modules/auth/auth.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./modules/interceptors/interceptor";


@NgModule({
  declarations: [
    AppComponent,
  ],
  // Imports Modules Custom of Modules
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
  ],
  // Provider for Http Autorization Header
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
