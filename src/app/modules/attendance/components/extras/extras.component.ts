import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Attendance, ModelAttendance} from "../../interfaces/attendance.interface";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Employee, JobCenter} from "../../../employee/interfaces/employee.interface";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TaskService} from "../../../task/services/task.service";
import {DateService} from "../../../../core/utils/date.service";
import * as fileSaver from "file-saver";
import {Extras, ModelExtras} from "../../interfaces/extras.interface";
import {ExtrasService} from "../../services/extras.service";

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit {

  displayedColumns: string[] = ['id', 'employee_name', 'job_center_name', 'start_date', 'end_date', 'start_hour', 'end_hour','options'];
  dataSource!: MatTableDataSource<Extras>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterForm!: FormGroup;
  submit!: boolean;
  employees: Employee[] = [];
  jobCenters: JobCenter[] = [];

  constructor(private extrasService: ExtrasService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private taskService: TaskService,
              private dateService: DateService,)
  {
    this.loadDataEmployees();
    this.loadDataGroups();
  }

  ngOnInit(): void {
    this.loadFilterForm();
    this.dataSource = new MatTableDataSource();
    this.getExtrasPaginator(this.paginator);
  }

  /**
   * Get all attendances and load data table.
   * @param event
   */
  getExtrasPaginator(event: any) : void {
    const paginator: MatPaginator = event;
    this.filterForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.extrasService.getExtras(this.filterForm.value)
      .subscribe((extras : ModelExtras) => {
          this.spinner.hide();
         console.log(extras.data)
          this.dataSource.data = extras.data
          this.totalItems = extras.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      )
  }

  /**
   * Filter Customer and Search
   */
  filterSelectEmployee(idEmployee: number){
    this.extrasService.getExtras(this.filterForm.value)
      .subscribe(res => {
        this.getExtrasPaginator(this.paginator);
      })
  }

  /**
   * Export Excel Services Finalized
   */
  reportAttendanceExcel(){
    this.spinner.show()
    this.extrasService.reportAttendanceExcel(this.filterForm.value).subscribe((res) => {

        let file = this.sharedService.createBlobToExcel(res);
        if (this.filterForm.value.initial_date !== ''){
          let date_initial = this.dateService.getFormatDataDate(this.filterForm.value.initial_date);
          let final_date = this.dateService.getFormatDataDate(this.filterForm.value.final_date);
          fileSaver.saveAs(file, `Reporte-Asistencia-General-${date_initial}-${final_date}`);
        }
        else {
          let date = this.dateService.getFormatDataDate(new Date());
          fileSaver.saveAs(file, `Reporte-Asistencia-General-${date}`);
        }

        this.spinner.hide();
        //this.cleanInput();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Report Finished
   * @param type
   */
  reportByEmployee(type : string){
    if(this.filterForm.value.employee === ''){
      this.sharedService.showSnackBar('El empleado no puede ser vacío');
      return
    }
    if(this.filterForm.value.initial_date === ''){
      this.sharedService.showSnackBar('El rango de Fechas no puede ser vacío');
      return
    }
    this.spinner.show();
    this.extrasService.exportReportByEmployee(this.filterForm.value, type).subscribe(res => {
        let file : any;
        if (type === 'excel') file = this.sharedService.createBlobToExcel(res);
        else file = this.sharedService.createBlobToPdf(res);
        let date_initial = this.dateService.getFormatDataDate(this.filterForm.value.initial_date);
        let final_date = this.dateService.getFormatDataDate(this.filterForm.value.final_date);

        fileSaver.saveAs(file, `Reporte-Asistencia-Empleado-${type}-${date_initial}-${final_date}`);

        this.spinner.hide();
        this.cleanInput();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  cleanInput(){
    this.filterForm.get('initial_date')?.setValue('');
    this.filterForm.get('final_date')?.setValue('');
  }

  /**
   * Array from service for Employees
   */
  loadDataEmployees(){
    this.taskService.getEmployees().subscribe(employees => {this.employees = employees.data} )
  }
  /**
   * Array from service for Groups
   */
  loadDataGroups(){
    this.taskService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.filterForm.get(field)?.invalid &&
      this.filterForm.get(field)?.touched
  }

  loadFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize],
      employee: '',
      group: '',
      initial_date: '',
      final_date: ''
    })
  }

}
