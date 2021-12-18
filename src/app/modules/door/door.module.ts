import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoorRoutingModule } from './door-routing.module';
import { MaterialModule} from "../../material/material.module";
import { FlexLayoutModule} from "@angular/flex-layout";
import { ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { CrudComponent} from "./components/crud/crud.component";


@NgModule({
  declarations: [
    HomeComponent,
    ListComponent,
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
