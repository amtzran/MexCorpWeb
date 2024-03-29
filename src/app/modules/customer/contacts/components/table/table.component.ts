import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {ContactService} from "../../services/contact.service";
import {Contact} from "../../models/contact.interface";
import {CrudComponent} from "../crud/crud.component";
import {ActivatedRoute} from "@angular/router";
import {CustomerTitle} from "../../../customers/interfaces/customer.interface";
import {CustomerServiceService} from "../../../customers/services/customer-service.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'phone', 'email', 'department','options'];
  dataSource!: MatTableDataSource<Contact>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize
  idCustomer!: string | null;
  contactPaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  customer: CustomerTitle = {
    name : '',
  };

  constructor(private contactService: ContactService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private activateRoute: ActivatedRoute,
              private customerService: CustomerServiceService,
              private spinner: NgxSpinnerService,) {
  }

  ngOnInit(): void {
    // get Id Route Customer
     this.activateRoute.paramMap.subscribe( params => {
       this.idCustomer = params.get('customer');
    })
    /**
     * Detail Data Customer
     */
    this.customerService.getCustomerById(Number(this.idCustomer)).subscribe(customer =>{
        this.customer = customer.data
      }
    )
    /*Formulario*/
    this.loadContactFilterForm();
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.getContactsPaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getContactsPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.contactPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.contactService.getContacts(this.contactPaginateForm.value, Number(this.idCustomer))
      .subscribe(contacts => {
        this.spinner.hide()
        this.dataSource.data = contacts.data
        this.totalItems = contacts.meta.total;
        }, (error => {
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

  deleteContact(contact: Contact) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: contact
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.contactService.deleteContact(contact.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getContactsPaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idContact
   * @param info
   */
  openDialogContact(edit: boolean, idContact: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idContact: idContact, info: info, idCustomer : this.idCustomer}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getContactsPaginator(this.paginator);
      }
    });
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadContactFilterForm(): void {
    this.contactPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

}
