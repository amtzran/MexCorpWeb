import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Customer} from "../../interfaces/customer.interface";
import {CustomerServiceService} from "../../services/customer-service.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ConfirmComponent} from "../../components/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogAddGroupComponent} from "../../../groups/components/dialog-add-group/dialog-add-group.component";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {CrudComponent} from "../../components/crud/crud.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [``]
})
export class ListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'name', 'reason_social', 'rfc', 'phone', 'options'];
  dataSource!: MatTableDataSource<Customer>;
  totalItems: number = 0;
  pageSize = 10;
  customerFilterForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private customerService: CustomerServiceService,
               private formBuilder: FormBuilder,
               private dialog : MatDialog,
               private snackBar: MatSnackBar
               ) {}

  ngOnInit() {
    /*Formulario*/
    this.loadCustomerFilterForm();

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.getCustomersPaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Get all customers and load data table.
   * @param event
   */
  getCustomersPaginator(event: any){
    const paginator: MatPaginator = event;
    this.customerFilterForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.customerService.getCustomers(this.customerFilterForm.value)
      .subscribe(customers => {
        this.dataSource.data = customers.results
        this.totalItems = customers.count;
      } )
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
              this.showSnackBar('Registro Eliminado')
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
      page_size: [this.pageSize]
    })
  }

  /**
   * Generate new snack bar with custom message.
   * @param msg
   */
  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000
    })
  }

}

