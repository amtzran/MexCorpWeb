import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Employee} from "../../../employee/interfaces/employee.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {EmployeeService} from "../../../employee/services/employee.service";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DateService} from "../../../../core/utils/date.service";
import {ConfirmComponent} from "../../../../shared/components/confirm/confirm.component";
import {ActiveComponent} from "../../../../shared/components/active/active.component";
import {CrudComponent} from "../../../employee/components/crud/crud.component";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {ProfileUser} from "../../../auth/interfaces/login.interface";
import {ResetPasswordComponent} from "../../../employee/components/reset-password/reset-password.component";
import * as fileSaver from "file-saver";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'color', 'job_title_name', 'is_active', 'options'];
  dataSource!: MatTableDataSource<Employee>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  liftingPaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private dateService: DateService,) {
  }

  ngOnInit(): void {
    /*Formulario*/
    this.loadLiftingFilterForm();
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.getLiftingsPaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getLiftingsPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.liftingPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.employeeService.getEmployees(this.liftingPaginateForm.value)
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

  deleteEmployee(employee: Employee) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250vw',
      data: employee
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.employeeService.deleteEmployee(employee.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getLiftingsPaginator(this.paginator);
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
          this.getLiftingsPaginator(this.paginator);
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
        this.getLiftingsPaginator(this.paginator);
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
        this.getLiftingsPaginator(this.paginator);
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

  /* Método que permite iniciar los filtros de rutas*/
  loadLiftingFilterForm(): void {
    this.liftingPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

}
