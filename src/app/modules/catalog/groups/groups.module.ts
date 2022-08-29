import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { TableGroupComponent } from './components/table-group/table-group.component';
import { GroupComponent } from './pages/group/group.component';
import {DialogAddGroupComponent} from "./components/dialog-add-group/dialog-add-group.component";
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {AgmCoreModule} from "@agm/core";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";


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
    ReactiveFormsModule,
    NgxSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDTay1aJA56eD1BRc4m87_2YSSDvPtEIKg',
      libraries: ['places']
    }),
    GooglePlaceModule
  ]
})
export class GroupsModule { }
