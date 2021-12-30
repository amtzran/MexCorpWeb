import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MessageDelete} from "../../interfaces/shared.interface";
import {Employee} from "../../../modules/employee/interfaces/employee.interface";
import {EmployeeService} from "../../../modules/employee/services/employee.service";

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styles: [
  ]
})
export class ActiveComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ActiveComponent>,
              private employeeService : EmployeeService,
              @Inject(MAT_DIALOG_DATA) public data: Employee) { }

  ngOnInit(): void {
  }

  status(){
    let status = this.data.is_active
    status = !status;
    this.employeeService.patchEmployeeStatus(this.data.id!, status).subscribe()
    this.dialogRef.close(true)
  }
  cancel(){
    this.dialogRef.close()
  }


}
