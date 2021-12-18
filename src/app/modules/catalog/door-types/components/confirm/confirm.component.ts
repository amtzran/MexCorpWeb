import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DoorType} from "../../models/door-type.interface";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styles: [
  ]
})
export class ConfirmComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DoorType) { }

  ngOnInit(): void {
  }

  delete(){
    this.dialogRef.close(true)
  }
  cancel(){
    this.dialogRef.close()
  }

}
