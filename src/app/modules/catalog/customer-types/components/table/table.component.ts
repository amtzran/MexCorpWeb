import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {CustomerType} from "../../models/customer-type.interface";
import {CustomerTypeService} from "../../services/customer-type.service";
import {ConfirmComponent} from "../confirm/confirm.component";
import {CrudComponent} from "../crud/crud.component";
import {SharedService} from "../../../../../shared/services/shared.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'options'];
  dataSource!: MatTableDataSource<CustomerType>;
  totalItems: number = 0;
  pageSize = 10;
  customerTypePaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private customerTypeService: CustomerTypeService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService) {
  }

  ngOnInit(): void {
    /*Formulario*/
    this.loadCustomerTypeFilterForm();
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.getCustomerTypePaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCustomerTypePaginator(event: any) {
    const paginator: MatPaginator = event;
    this.customerTypePaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.customerTypeService.getCustomerTypes(this.customerTypePaginateForm.value)
      .subscribe(customerTypes => {
        this.dataSource.data = customerTypes.results
        this.totalItems = customerTypes.count;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteCustomerType(customerType: CustomerType) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: customerType
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.customerTypeService.deleteCustomerType(customerType.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getCustomerTypePaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idCustomerType
   * @param info
   */
  openDialogCustomerType(edit: boolean, idCustomerType: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idCustomerType: idCustomerType, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getCustomerTypePaginator(this.paginator);
      }
    });
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadCustomerTypeFilterForm(): void {
    this.customerTypePaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

}
