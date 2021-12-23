import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "./header/header.component";
import {SideNavComponent} from "./side-nav/side-nav.component";
import {FooterComponent} from "./footer/footer.component";
import {RouterModule} from "@angular/router";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MaterialModule} from "../../material/material.module";
import { ActiveComponent } from './active/active.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SideNavComponent,
    FooterComponent,
    ActiveComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    SideNavComponent,
    FooterComponent
  ]
})
export class SharedModule { }
