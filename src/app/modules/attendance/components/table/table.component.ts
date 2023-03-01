import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DateService} from "../../../../core/utils/date.service";
import {AttendanceService} from "../../services/attendance.service";
import {Attendance, ModelAttendance} from "../../interfaces/attendance.interface";
import {Employee, JobCenter} from "../../../employee/interfaces/employee.interface";
import {TaskService} from "../../../task/services/task.service";
import * as fileSaver from "file-saver";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  constructor(private attendanceService: AttendanceService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private taskService: TaskService,
              private dateService: DateService,)
  {

  }

  ngOnInit(): void {

  }


}
