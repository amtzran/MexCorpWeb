import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styles: [
  ]
})
export class CredentialsComponent implements OnInit {

  result!: any;

  constructor(
    private dialogRef: MatDialogRef<CredentialsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.result = this.data.errors['0']
  }

  close() {
    this.dialogRef.close()
  }

}
