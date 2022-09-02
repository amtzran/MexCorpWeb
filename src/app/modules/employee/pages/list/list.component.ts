import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Employee, JobCenter} from "../../interfaces/employee.interface";
import {MatDialog} from "@angular/material/dialog";
import {EmployeeService} from "../../services/employee.service";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {CrudComponent} from "../../components/crud/crud.component";
import {SharedService} from "../../../../shared/services/shared.service";
import {ConfirmComponent} from "../../../../shared/components/confirm/confirm.component";
import {ActiveComponent} from "../../../../shared/components/active/active.component";
import {NgxSpinnerService} from "ngx-spinner";
import {ProfileUser} from "../../../auth/interfaces/login.interface";
import {ResetPasswordComponent} from "../../components/reset-password/reset-password.component";
import * as fileSaver from "file-saver";
import {DateService} from "../../../../core/utils/date.service";
import {TaskService} from "../../../task/services/task.service";
import {Turn} from "../../../catalog/turns/interfaces/turn.interface";
import {JobTitle} from "../../../catalog/job-titles/models/job-title.interface";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: []
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'color', 'job_title_name', 'is_active', 'options'];
  dataSource!: MatTableDataSource<Employee>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  employeePaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  jobCenters: JobCenter[] = [];
  employees: Employee[] = [];
  turns: Turn[] = [];
  jobs: any[] = [];

  constructor(private employeeService: EmployeeService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private dateService: DateService,
              private taskService: TaskService)
  {
    this.loadDataEmployees();
    this.loadDataGroups();
    this.loadDataTurns();
    this.loadDataJobTitles();
  }

  ngOnInit(): void {
    /*Formulario*/
    this.loadEmployeeFilterForm();
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.getEmployeesPaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getEmployeesPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.employeePaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.employeeService.getEmployees(this.employeePaginateForm.value)
      .subscribe(employees => {
        this.spinner.hide()
        this.dataSource.data = employees.data
        this.totalItems = employees.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(employee: Employee) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '50vw',
      data: employee
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.employeeService.deleteEmployee(employee.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getEmployeesPaginator(this.paginator);
            })
        }
      })

  }

  status(employee: number) {
    // Show Dialog
    const dialog = this.dialog.open(ActiveComponent, {
      width: '250',
      data: employee
    })
    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.sharedService.showSnackBar('Status Actualizado')
          this.getEmployeesPaginator(this.paginator);
        }
      })
  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idEmployee
   * @param info
   */
  openDialogEmployee(edit: boolean, idEmployee: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idEmployee: idEmployee, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getEmployeesPaginator(this.paginator);
      }
    });
  }

  /**
   *
   * @param employee
   */
  resetPassword(employee: ProfileUser){
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: employee
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getEmployeesPaginator(this.paginator);
      }
    });
  }

  toolsReport(employee : Employee){
    this.spinner.show()
    this.employeeService.exportReportTools(Number(employee.id)).subscribe(res => {
    this.spinner.hide()
    let date = this.dateService.getFormatDataDate(new Date())
    let file = this.sharedService.createBlobToPdf(res);
    fileSaver.saveAs(file, `Reporte-Herramientas-${employee.name}-${date}`);
  },error => {
      this.spinner.hide()
      this.sharedService.errorDialog(error)
    })
  }

  gafeteReport(employee : Employee){
    this.spinner.show()
    this.employeeService.exportReportGafete(Number(employee.id)).subscribe(res => {
      this.spinner.hide()
      let date = this.dateService.getFormatDataDate(new Date())
      let file = this.sharedService.createBlobToPdf(res);
      fileSaver.saveAs(file, `Gafete-${employee.name}-${date}`);
    },error => {
      this.spinner.hide()
      this.sharedService.errorDialog(error)
    })
  }

  /**
   * Filter Customer and Search
   */
  filterSelect(){
    this.employeeService.getEmployees(this.employeePaginateForm.value)
      .subscribe(res => {
        this.getEmployeesPaginator(this.paginator);
      })
  }

  /**
   * Export Excel Services Finalized
   */
  reportEmployeeExcel(){
    this.spinner.show()
    this.employeeService.reportEmployeesExcel(this.employeePaginateForm.value).subscribe((res) => {

        let file = this.sharedService.createBlobToExcel(res);
        if (this.employeePaginateForm.value.initial_date !== ''){
          let date_initial = this.dateService.getFormatDataDate(this.employeePaginateForm.value.initial_date);
          let final_date = this.dateService.getFormatDataDate(this.employeePaginateForm.value.final_date);
          fileSaver.saveAs(file, `Reporte-Empleados-${date_initial} a ${final_date}`);
        }
        else {
          let date = this.dateService.getFormatDataDate(new Date());
          fileSaver.saveAs(file, `Reporte-Empleados-${date}`);
        }

        this.spinner.hide();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Array from service for Groups
   */
  loadDataGroups(){
    this.taskService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
  }

  /**
   * Array from service for Employees
   */
  loadDataEmployees(){
    this.taskService.getEmployees().subscribe(employees => {this.employees = employees.data} )
  }

  /**
   * Array from service for Turns
   */
  loadDataTurns(){
    this.employeeService.getTurns().subscribe(turns => {this.turns = turns.data} )
  }

  /**
   * Array from service for Turns
   */
  loadDataJobTitles(){
    this.employeeService.getJobs().subscribe(jobTitles => {this.jobs = jobTitles.data} )
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.employeePaginateForm.get(field)?.invalid && this.employeePaginateForm.get(field)?.touched
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadEmployeeFilterForm(): void {
    this.employeePaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize],
      employee: '',
      job_center: '',
      job_title: '',
      turn: '',
      initial_date: '',
      final_date: ''
    })
  }

}
