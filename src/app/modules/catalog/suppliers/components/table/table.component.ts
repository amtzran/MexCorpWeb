import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {ModelSupplier, Supplier} from "../../interfaces/suppliers.interface";
import {SupplierService} from "../../services/supplier.service";
import {CrudComponent} from "../crud/crud.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'options'];
  dataSource!: MatTableDataSource<Supplier>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize
  paginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private supplierService: SupplierService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.loadSupplierFilterForm();
    this.getSuppliersPaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getSuppliersPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.paginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.supplierService.getSuppliers(this.paginateForm.value)
      .subscribe(
        (suppliers: ModelSupplier) => {
          this.spinner.hide()
          this.dataSource.data = suppliers.data
          this.totalItems = suppliers.meta.total;
        },
        (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteSupplier(supplier: Supplier) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: supplier
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.supplierService.deleteSupplier(supplier.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getSuppliersPaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idSupplier
   * @param info
   */
  openDialogSupplier(edit: boolean, idSupplier: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idSupplier: idSupplier, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getSuppliersPaginator(this.paginator);
      }
    });
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadSupplierFilterForm(): void {
    this.paginateForm = this.formBuilder.group({
      page: [],
      page_size: this.pageSize
    })
  }

}
