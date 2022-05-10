import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from "./modules/auth/auth.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./modules/interceptors/interceptor";

// Add Changes Language My App
import localeEsMx from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEsMx)

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
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-MX'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
