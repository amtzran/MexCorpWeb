import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentRoutingModule } from './comment-routing.module';
import { TableComponent } from './components/table/table.component';
import { CrudComponent } from './components/crud/crud.component';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {CommentComponent} from "./comment.component";


@NgModule({
  declarations: [
    TableComponent,
    CrudComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    CommentRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class CommentModule { }
