import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { MaterialModule } from "../../material/material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MainComponent } from './pages/main/main.component';
import { DashboardComponent } from './protected/dashboard/dashboard.component';
import { CredentialsComponent } from './componenets/credentials/credentials.component';


@NgModule({
  declarations: [
    LoginComponent,
    MainComponent,
    DashboardComponent,
    CredentialsComponent
  ],
  exports: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule { }
