import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { TableGroupComponent } from './components/table-group/table-group.component';
import { GroupComponent } from './pages/group/group.component';
import {DialogAddGroupComponent} from "./components/dialog-add-group/dialog-add-group.component";
import {MaterialModule} from "../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    DialogAddGroupComponent,
    TableGroupComponent,
    GroupComponent,
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class GroupsModule { }
