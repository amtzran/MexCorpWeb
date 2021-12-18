import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoorRoutingModule } from './door-routing.module';
import { MaterialModule} from "../../material/material.module";
import { FlexLayoutModule} from "@angular/flex-layout";
import { ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { CrudComponent} from "./components/crud/crud.component";


@NgModule({
  declarations: [
    HomeComponent,
    ListComponent,
    ConfirmComponent,
    CrudComponent
  ],
  imports: [
    CommonModule,
    DoorRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class DoorModule { }
