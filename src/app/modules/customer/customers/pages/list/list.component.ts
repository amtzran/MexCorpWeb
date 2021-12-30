import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Customer, ModelCustomer} from "../../interfaces/customer.interface";
import {CustomerServiceService} from "../../services/customer-service.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {CrudComponent} from "../../components/crud/crud.component";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [`
  .tableResponsive{
    width: 100%;
    overflow-x: auto;
  }
  `]
})
export class ListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'name', 'reason_social', 'rfc', 'phone', 'address', 'contract_name', 'customer_type_name','options'];
  dataSource!: MatTableDataSource<Customer>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  customerFilterForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private customerService: CustomerServiceService,
               private formBuilder: FormBuilder,
               private dialog : MatDialog,
               private sharedService: SharedService
               ) {}

  ngOnInit() {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    /*Formulario*/
    this.loadCustomerFilterForm();
    this.getCustomersPaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /**
   * Get all customers and load data table.
   * @param event
   */
  getCustomersPaginator(event: any) : void {
    const paginator: MatPaginator = event;
    this.customerFilterForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.customerService.getCustomers(this.customerFilterForm.value)
      .subscribe((customers : ModelCustomer) => {
        this.dataSource.data = customers.data
        this.totalItems = customers.meta.total;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Send envía parámetro a mi modal
   * @param customer
   */
  deleteCustomer(customer: Customer){
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: customer
    })

    dialog.afterClosed().subscribe(
      ( result ) => {
        if ( result ) {
          this.customerService.deleteCustomer(customer.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getCustomersPaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idCustomer
   * @param info
   */
  openDialogCustomer(edit: boolean, idCustomer: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idCustomer: idCustomer, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getCustomersPaginator(this.paginator);
      }
    });
  }

  /*Método que permite iniciar los filtros de rutas*/
  loadCustomerFilterForm(): void{
    this.customerFilterForm = this.formBuilder.group({
      page: [],
      page_size: this.pageSize,
    })
  }

}

