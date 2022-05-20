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
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {Lifting} from "../../interfaces/lifting.interface";
import {LiftingService} from "../../services/lifting.service";
import {CrudComponent} from "../crud/crud.component";
import {fakeAsync} from "@angular/core/testing";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'folio', 'customer', 'employee', 'access', 'options'];
  dataSource!: MatTableDataSource<Lifting>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  liftingPaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private liftingService: LiftingService,
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
    this.liftingService.getLiftings(this.liftingPaginateForm.value)
      .subscribe(liftings => {
          this.spinner.hide()
          this.dataSource.data = liftings.data
          this.totalItems = liftings.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /*deleteEmployee(employee: Employee) {
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

  }*/

  /**
   * Open dialog for add and update lifting.
   * @param edit
   * @param idLifting
   * @param info
   */
  openDialogLifting(edit: boolean, idLifting: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: false,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '95%',
      data: {edit: edit, idLifting: idLifting, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getLiftingsPaginator(this.paginator);
      }
    });
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadLiftingFilterForm(): void {
    this.liftingPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

}
