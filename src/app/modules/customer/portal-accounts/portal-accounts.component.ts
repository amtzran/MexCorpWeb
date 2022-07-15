import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CustomerTitle} from "../customers/interfaces/customer.interface";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../shared/services/shared.service";
import {ActivatedRoute} from "@angular/router";
import {CustomerServiceService} from "../customers/services/customer-service.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ModalResponse} from "../../../core/utils/ModalResponse";
import {ConfirmComponent} from "../../../shared/components/confirm/confirm.component";
import {PortalAccountService} from "./services/portal-account.service";
import {PortalAccount} from "./interfaces/portal-account.interface";
import {CrudComponent} from "./components/crud/crud.component";

@Component({
  selector: 'app-portal-accounts',
  templateUrl: './portal-accounts.component.html',
  styleUrls: ['./portal-accounts.component.css']
})
export class PortalAccountsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'username','options'];
  dataSource!: MatTableDataSource<PortalAccount>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize
  idCustomer!: string | null;
  portalAccountPaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  customer: CustomerTitle = {
    name : '',
  };

  constructor(private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private activateRoute: ActivatedRoute,
              private customerService: CustomerServiceService,
              private spinner: NgxSpinnerService,
              private portalAccountService: PortalAccountService) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe( params => {
      this.idCustomer = params.get('customer');
    })
    this.customerService.getCustomerById(Number(this.idCustomer)).subscribe(customer =>{
        this.customer = customer.data
      }
    )
    this.loadPortalAccountFilterForm();
    this.dataSource = new MatTableDataSource();
    this.getPortalAccountsPaginator(this.paginator);
  }

  getPortalAccountsPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.portalAccountPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.portalAccountService.getPortalAccounts(this.portalAccountPaginateForm.value, Number(this.idCustomer))
      .subscribe(portalAccounts => {
          this.spinner.hide()
          this.dataSource.data = portalAccounts.data
          this.totalItems = portalAccounts.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      )
  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idPortalAccount
   * @param info
   */
  openDialogPortalAccount(edit: boolean, idPortalAccount: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idPortalAccount: idPortalAccount, info: info, idCustomer : this.idCustomer}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getPortalAccountsPaginator(this.paginator);
      }
    });
  }

  deleteContact(portalAccount: PortalAccount) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: portalAccount
    })

     dialog.afterClosed().subscribe(
       (result) => {
         if (result) {
           this.portalAccountService.deleteAccount(portalAccount.id!)
             .subscribe(resp => {
               this.sharedService.showSnackBar('Registro Eliminado')
               this.getPortalAccountsPaginator(this.paginator);
             })
         }
       })

  }

  /* Método que permite iniciar los filtros de rutas*/
  loadPortalAccountFilterForm(): void {
    this.portalAccountPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

}
