import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {Lifting, Quotation} from "../../interfaces/lifting.interface";
import {LiftingService} from "../../services/lifting.service";
import {CrudComponent} from "../crud/crud.component";
import {ConceptComponent} from "../concept/concept.component";
import {ConfirmStatusComponent} from "../confirm-status/confirm-status.component";
import {SendEmailComponent} from "../send-email/send-email.component";
import {Customer} from "../../../customer/customers/interfaces/customer.interface";
import {Employee, JobCenter} from "../../../employee/interfaces/employee.interface";
import {WorkType} from "../../../catalog/work-types/models/work-type.interface";
import {Task} from "../../../task/models/task.interface";
import {Door} from "../../../customer/doors/interfaces/door.interface";
import {TaskService} from "../../../task/services/task.service";
import {debounceTime, map, Observable, startWith} from "rxjs";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DateService} from "../../../../core/utils/date.service";
import {ConfirmComponent} from "../../../../shared/components/confirm/confirm.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [`
    .color-green {
      color: green;
    }`
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'folio', 'customer', 'employee', 'job_center', 'work_type', 'date', 'status', 'options'];
  displayedColumnsQuote: string[] = ['id', 'folio', 'customer', 'place', 'applicant', 'date', 'status', 'total', 'options'];
  dataSource!: MatTableDataSource<Lifting>;
  dataSourceQuote!: MatTableDataSource<Quotation>;
  totalItems!: number;
  totalItemsQuote!: number;
  pageSize = this.sharedService.pageSize;
  liftingPaginateForm!: FormGroup;
  quotationPaginateForm!: FormGroup;
  @ViewChild('paginator', {static: true}) paginator!: MatPaginator;
  @ViewChild('paginatorQuote', {static: true}) paginatorQuote!: MatPaginator;

  customers: Customer[] = [];
  jobCenters: JobCenter[] = [];
  employees: Employee[] = [];
  workTypes: WorkType[] = [];
  tasksSelect: Task[] = [];
  doors: Door[] = [];
  dateForm!: FormGroup;
  dateFormQuote!: FormGroup;
  formFolio = new FormControl();
  formFolioQuote = new FormControl();

  constructor(private liftingService: LiftingService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private taskService: TaskService,
              private dateService: DateService)
  {
    this.loadFilterFolio();
    this.loadFilterFolioQuote();
    this.loadDataCustomers();
    this.loadDataEmployees();
    this.loadDataGroups();
    this.loadDataWorkTypes();
  }

  ngOnInit(): void {
    /*Formulario*/
    this.loadLiftingFilterForm();
    this.loadQuotationFilterForm();
    this.lodDateForm();
    this.lodDateQuoteForm();
    this.dataSource = new MatTableDataSource();
    this.dataSourceQuote = new MatTableDataSource();
    this.getLiftingsPaginator(this.paginator);
    this.getQuotationsPaginator(this.paginatorQuote)
    this.updateEventSharedService()
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

  getQuotationsPaginator(event: any) {
    const paginatorQuote: MatPaginator = event;
    this.quotationPaginateForm.get('page')?.setValue(paginatorQuote.pageIndex + 1);
    this.spinner.show()
    this.liftingService.getQuotations(this.quotationPaginateForm.value)
      .subscribe(quotations => {
          this.spinner.hide()
          this.dataSourceQuote.data = quotations.data
          this.totalItemsQuote = quotations.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /**
   * Open dialog for add and update lifting.
   * @param edit
   * @param idLifting
   * @param info
   */
  openDialogLifting(edit: boolean, idLifting: number | '', info: boolean): void {
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
        this.getQuotationsPaginator(this.paginatorQuote);
      }
    });
  }

  /**
   * Event click show url (Pdf)
   * @param reportPdf
   */
  viewPdf(reportPdf: string){
    window.open(reportPdf)
  }

  /**
   * Generate Pdf Quote
   * @param row
   * @param showPdf
   */
  generateQuote(row: Quotation, showPdf: boolean) {
    this.spinner.show()
    this.liftingService.generatePdfQuote(row.id)
      .subscribe(quote => {
          this.spinner.hide()
          if(showPdf) window.open(quote.quote_pdf)
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /**
   * Event click Quotation
   * @param row
   */
  openQuotation(row: Lifting){
    this.spinner.show()
    this.liftingService.addQuotation(row)
      .subscribe(response => {
          this.spinner.hide()
        const dialogRef = this.dialog.open(ConceptComponent, {
          autoFocus: false,
          disableClose: false,
          maxWidth: '100vw',
          maxHeight: '100vh',
          width: '95%',
          data: {row: response.data}
        });

        dialogRef.afterClosed().subscribe(res => {
          if (res === ModalResponse.UPDATE) {
            this.getLiftingsPaginator(this.paginator);
            this.getQuotationsPaginator(this.paginatorQuote);
          }
        });

        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /**
   * Open dialog Concept Quote
   * @param row
   */
  openDialogConcept(row: Quotation): void {
    const dialogRef = this.dialog.open(ConceptComponent, {
      autoFocus: false,
      disableClose: false,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '95%',
      data: {row: row}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        console.log(res)
        this.getLiftingsPaginator(this.paginator);
        this.getQuotationsPaginator(this.paginatorQuote);
      }
    });
  }

  /**
   * Open dialog Concept Quote
   * @param row
   * @param status
   */
  statusPending(row: Quotation, status: string): void {
    const dialogRef = this.dialog.open(ConfirmStatusComponent, {
      autoFocus: false,
      disableClose: false,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '30%',
      data: {row: row, status: status}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getLiftingsPaginator(this.paginator);
        this.getQuotationsPaginator(this.paginatorQuote);
      }
    });
  }

  /**
   * Open dialog Concept Quote
   * @param row
   */
  sendEmail(row: Quotation): void {
    this.generateQuote(row, false);
    const dialogRef = this.dialog.open(SendEmailComponent, {
      autoFocus: false,
      disableClose: false,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '40%',
      data: {row: row}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getLiftingsPaginator(this.paginator);
        this.getQuotationsPaginator(this.paginatorQuote);
      }
    });
  }

  // Form for Page table
  lodDateForm() : void {
    this.dateForm = this.formBuilder.group({
      initial_date: [{value: '', disabled: false}],
      final_date: [{value: '', disabled: false}],
    })
  }

  // Form for Page table
  lodDateQuoteForm() : void {
    this.dateFormQuote = this.formBuilder.group({
      initial_date: [{value: '', disabled: false}],
      final_date: [{value: '', disabled: false}],
    })
  }

  loadFilterFolio() {
     this.formFolio.valueChanges.pipe(
      debounceTime(500),
      map(value => typeof value === 'string' ? value : value.folio),
    ).subscribe(v => {
       this.liftingPaginateForm.get('folio')?.setValue(v);
       this.liftingService.getLiftings(this.liftingPaginateForm.value).subscribe(res =>{
         this.getLiftingsPaginator(this.paginator);
       })
    });
  }

  loadFilterFolioQuote() {
    this.formFolioQuote.valueChanges.pipe(
      debounceTime(500),
      map(value => typeof value === 'string' ? value : value.folio),
    ).subscribe(v => {
      this.quotationPaginateForm.get('folio')?.setValue(v);
      this.liftingService.getQuotations(this.quotationPaginateForm.value).subscribe(res =>{
        this.getQuotationsPaginator(this.paginatorQuote);
      })
    });
  }

  /**
   * Filter Customers in Lifting
   * @param idCustomer
   */
  filterCustomer(idCustomer: number){
    this.liftingPaginateForm.get('customer')?.setValue(idCustomer);
    this.liftingService.getLiftings(this.liftingPaginateForm.value).subscribe(res =>{
      this.getLiftingsPaginator(this.paginator);
    })
  }

  /**
   * Filter Customers in Lifting
   * @param idEmployee
   */
  filterEmployee(idEmployee: number){
    this.liftingPaginateForm.get('employee')?.setValue(idEmployee);
    this.liftingService.getLiftings(this.liftingPaginateForm.value).subscribe(res =>{
      this.getLiftingsPaginator(this.paginator);
    })
  }

  /**
   * Filter Customers in Lifting
   * @param idGroup
   */
  filterGroup(idGroup: number){
    this.liftingPaginateForm.get('group')?.setValue(idGroup);
    this.liftingService.getLiftings(this.liftingPaginateForm.value).subscribe(res =>{
      this.getLiftingsPaginator(this.paginator);
    })
  }

  /**
   * Filter Customers in Lifting
   * @param idWorkType
   */
  filterWorkType(idWorkType: number){
    this.liftingPaginateForm.get('work_type')?.setValue(idWorkType);
    this.liftingService.getLiftings(this.liftingPaginateForm.value).subscribe(res =>{
      this.getLiftingsPaginator(this.paginator);
    })
  }

  /**
   * Filter Customers in Lifting
   * @param status
   */
  filterStatus(status: string){
    this.liftingPaginateForm.get('status')?.setValue(status);
    this.liftingService.getLiftings(this.liftingPaginateForm.value).subscribe(res =>{
      this.getLiftingsPaginator(this.paginator);
    })
  }

  /**
   * Filter By Date in Lifting
   * @param event
   */
  filterDate(event: MatDatepickerInputEvent<any>){
    let initial_date = this.dateService.getFormatDataDate(this.dateForm.value.initial_date)
    let final_date = this.dateService.getFormatDataDate(this.dateForm.value.final_date)
    this.liftingPaginateForm.get('initial_date')?.setValue(initial_date);
    this.liftingPaginateForm.get('final_date')?.setValue(final_date);
    this.liftingService.getLiftings(this.liftingPaginateForm.value).subscribe(res =>{
      this.getLiftingsPaginator(this.paginator);
    })
  }

  resetFilterDate() : void {
    this.liftingPaginateForm.get('initial_date')?.setValue('');
    this.liftingPaginateForm.get('final_date')?.setValue('');
    this.liftingService.getLiftings(this.liftingPaginateForm.value).subscribe(res =>{
      this.getLiftingsPaginator(this.paginator);
    })
  }

  /**
   * Filter Customers in Quotes
   * @param status
   */
  filterStatusQuote(status: string){
    this.quotationPaginateForm.get('status')?.setValue(status);
    this.liftingService.getQuotations(this.liftingPaginateForm.value).subscribe(res =>{
      this.getQuotationsPaginator(this.paginatorQuote);
    })
  }

  /**
   * Filter By Date in Quotes
   * @param event
   */
  filterDateQuote(event: MatDatepickerInputEvent<any>){
    let initial_date = this.dateService.getFormatDataDate(this.dateFormQuote.value.initial_date)
    let final_date = this.dateService.getFormatDataDate(this.dateFormQuote.value.final_date)
    this.quotationPaginateForm.get('initial_date')?.setValue(initial_date);
    this.quotationPaginateForm.get('final_date')?.setValue(final_date);
    this.liftingService.getQuotations(this.liftingPaginateForm.value).subscribe(res =>{
      this.getQuotationsPaginator(this.paginatorQuote);
    })
  }

  resetFilterDateQuote() : void {
    this.quotationPaginateForm.get('initial_date')?.setValue('');
    this.quotationPaginateForm.get('final_date')?.setValue('');
    this.liftingService.getQuotations(this.liftingPaginateForm.value).subscribe(res =>{
      this.getQuotationsPaginator(this.paginatorQuote);
    })
  }


  /* Método que permite iniciar los filtros de rutas*/
  loadLiftingFilterForm(): void {
    this.liftingPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize],
      folio: '',
      customer: '',
      employee: '',
      group: '',
      work_type: '',
      status: '',
      initial_date: '',
      final_date: ''
    })
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadQuotationFilterForm(): void {
    this.quotationPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize],
      folio: '',
      initial_date: '',
      final_date: '',
      status: ''
    })
  }

  /**
   * Array from service for Customers
   */
  loadDataCustomers(){
    this.taskService.getCustomers().subscribe(customers => {this.customers = customers.data} )
  }

  /**
   * Array from service for Groups
   */
  loadDataGroups(){
    this.taskService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
  }

  /**
   * Array from service for Employees
   */
  loadDataEmployees(){
    this.taskService.getEmployees().subscribe(employees => {this.employees = employees.data} )
  }

  /**
   * Array from service for Employees
   */
  loadDataWorkTypes(){
    this.taskService.getWorkTypes().subscribe(workTypes => {this.workTypes = workTypes.data} )
  }

  deleteQuote(quote: Quotation) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: quote
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.liftingService.deleteQuote(quote.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getQuotationsPaginator(this.paginatorQuote);
              this.getLiftingsPaginator(this.paginator);
            })
        }
      })

  }

  deleteLifting(lifting: Lifting) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: lifting
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.liftingService.deleteLifting(lifting.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getLiftingsPaginator(this.paginator);
              this.getQuotationsPaginator(this.paginatorQuote);
            })
        }
      })

  }

  /**
   * Services Shared for update any Component
   */
  updateEventSharedService(){
    this.sharedService.changeEvent.subscribe(change => {
      this.getQuotationsPaginator(this.paginatorQuote)
    })
  }

}
