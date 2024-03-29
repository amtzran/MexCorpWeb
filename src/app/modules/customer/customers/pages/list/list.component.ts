import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Contract, Customer, ModelCustomer} from "../../interfaces/customer.interface";
import {CustomerServiceService} from "../../services/customer-service.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {CrudComponent} from "../../components/crud/crud.component";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";
import {NgxSpinnerService} from "ngx-spinner";
import * as fileSaver from "file-saver";
import {DateService} from "../../../../../core/utils/date.service";
import {ReportService} from "../../../../report/services/report.service";
import {CustomerType} from "../../../../catalog/customer-types/models/customer-type.interface";
import {TaskService} from "../../../../task/services/task.service";
import {ContractService} from "../../../../catalog/contracts/services/contract.service";
import {CustomerTypeService} from "../../../../catalog/customer-types/services/customer-type.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'name', 'reason_social', 'phone', 'address', 'contract_name', 'customer_type_name', 'created_at', 'options'];
  dataSource!: MatTableDataSource<Customer>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  customerFilterForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  customers!: Customer[];
  contracts!: Contract[];
  customerTypes!: CustomerType[];
  filterForm!: FormGroup;
  submit!: boolean;

  constructor( private customerService: CustomerServiceService,
               private formBuilder: FormBuilder,
               private dialog : MatDialog,
               private sharedService: SharedService,
               private spinner: NgxSpinnerService,
               private dateService: DateService,
               private reportService: ReportService,
               private taskService: TaskService,
               private contractService: ContractService,
               private customerTypeService: CustomerTypeService
               ) {}

  ngOnInit() {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    /*Formulario*/
    this.loadFilterForm();
    this.loadCustomerFilterForm();
    this.getCustomersPaginator(this.paginator);
    this.loadCustomers();
    this.loadContracts();
    this.loadCustomerTypes();
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
    this.spinner.show()
    this.customerService.getCustomers(this.customerFilterForm.value, this.filterForm.value)
      .subscribe((customers : ModelCustomer) => {
        this.spinner.hide()
        this.dataSource.data = customers.data
        this.totalItems = customers.meta.total;
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

  /**
   * Export Excel and Pdf with filters
   * @param type
   */
  downloadReport(type: string){
    this.validateForm()
    this.spinner.show()
    this.customerService.exportReportCustomer(this.filterForm.value, type).subscribe(res => {
        let file : any;
        if (type === 'excel') file = this.sharedService.createBlobToExcel(res);
        else file = this.sharedService.createBlobToPdf(res);
        let currentDate = new Date();
        let date_initial, final_date;
        if (this.filterForm.value.initial_date) {
          date_initial = this.dateService.getFormatDataDate(this.filterForm.value.initial_date)
          final_date = this.dateService.getFormatDataDate(this.filterForm.value.final_date)
        }
        else {
          date_initial = this.dateService.getFormatDataDate(currentDate);
          final_date = this.dateService.getFormatDataDate(currentDate);
        }

        fileSaver.saveAs(file, `Reporte-Clientes-${date_initial}-${final_date}`);

        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * load Form Reactive Form
   */
  loadFilterForm() : void {
    this.filterForm = this.formBuilder.group({
      initial_date: [{value: '', disabled:false},],
      final_date: [{value: '', disabled:false},],
      customer: [{value: '', disabled:false},],
      contract: [{value: '', disabled:false},],
      customer_type: [{value: '', disabled:false},],
    });
  }

  /**
   * Filter By Customer
   */
  filterSelect(){
    this.customerService.getCustomers(this.customerFilterForm.value, this.filterForm.value).subscribe(res => {
      this.getCustomersPaginator(this.paginator);
    })
  }

  /**
   * Service Customers
   */
  loadCustomers(){
    this.taskService.getCustomers().subscribe(customers => {this.customers = customers.data} )
  }

  /**
   * Service Contracts
   */
  loadContracts(){
    this.contractService.getContracts(this.customerFilterForm.value).subscribe(contracts => {this.contracts = contracts.data} )
  }

  /**
   * Service Customer Types
   */
  loadCustomerTypes(){
    this.customerTypeService.getCustomerTypes(this.customerFilterForm.value).subscribe(customerTypes => {this.customerTypes = customerTypes.data} )
  }


  /**
   * Validate form in general
   */
  validateForm(){
    this.submit = true;
    if(this.filterForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.filterForm.get(field)?.invalid && this.filterForm.get(field)?.touched
  }

}

