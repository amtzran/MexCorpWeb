import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MessageEdit} from "../../models/task.interface";

@Component({
  selector: 'app-confirm-edit',
  templateUrl: './confirm-edit.component.html',
  styles: [
  ]
})
export class ConfirmEditComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfirmEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MessageEdit) { }

  ngOnInit(): void {
  }

  edit(){
    this.dialogRef.close(true)
  }
  cancel(){
    this.dialogRef.close()
  }

}
