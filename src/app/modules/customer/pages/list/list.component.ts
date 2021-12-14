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


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [``]
})
export class ListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'name', 'reason_social', 'rfc', 'phone', 'options'];
  dataSource!: MatTableDataSource<Customer>;
  customerPaginateForm!: FormGroup;

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  totalitems: number = 0;
  pageSize = 10;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private customerService: CustomerServiceService,
               private formBuilder: FormBuilder,
               private dialog : MatDialog,
               private snackBar: MatSnackBar
               ) {}

  ngOnInit() {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.loadCustomerPaginateForm();
    this.getCustomers(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCustomers(event: any){
    const paginator: MatPaginator = event;
    this.customerPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.customerService.getCustomers(this.customerPaginateForm.value)
      .subscribe(customers => {
        this.dataSource.data = customers.results
        this.totalitems = customers.count;
      } )
  }

  /*Método que permite iniciar los filtros de rutas*/
  loadCustomerPaginateForm(): void{
    this.customerPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

  delete(customer: Customer){
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
              this.getCustomers(this.paginator);
            })
        }
      })

  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000
    })
  }

}

