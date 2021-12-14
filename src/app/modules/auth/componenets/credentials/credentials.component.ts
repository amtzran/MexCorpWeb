import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthResponse} from "../../interfaces/login.interface";

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styles: [
  ]
})
export class CredentialsComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CredentialsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuthResponse
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  close() {
    this.dialogRef.close()
  }

}
