import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DateService} from "../../../../core/utils/date.service";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {Lifting, Quotation} from "../../interfaces/lifting.interface";
import {LiftingService} from "../../services/lifting.service";
import {CrudComponent} from "../crud/crud.component";
import {ConceptComponent} from "../concept/concept.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'folio', 'customer', 'employee', 'job_center', 'work_type', 'date', 'status', 'options'];
  displayedColumnsQuote: string[] = ['id', 'customer', 'date', 'status', 'amount', 'options'];
  dataSource!: MatTableDataSource<Lifting>;
  dataSourceQuote!: MatTableDataSource<Quotation>;
  totalItems!: number;
  totalItemsQuote!: number;
  pageSize = this.sharedService.pageSize;
  liftingPaginateForm!: FormGroup;
  quotationPaginateForm!: FormGroup;
  @ViewChild('paginator', {static: true}) paginator!: MatPaginator;
  @ViewChild('paginatorQuote', {static: true}) paginatorQuote!: MatPaginator;

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
    this.loadQuotationFilterForm();
    // Assign the data to the data source for the table to render
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
   */
  generateQuote(row: Quotation) {
    this.spinner.show()
    this.liftingService.generatePdfQuote(row.id)
      .subscribe(quote => {
          this.spinner.hide()
          window.open(quote.quote_pdf)
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
      .subscribe(row => {
          this.spinner.hide()

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
            this.getLiftingsPaginator(this.paginator);
          }
        });

        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /**
   * Open dialog for add and update lifting.
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
        this.getLiftingsPaginator(this.paginator);
      }
    });
  }

  /**
   * Event click Quotation
   * @param row
   */
  openQuoted(row: Lifting){
    console.log('Cotizado')
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadLiftingFilterForm(): void {
    this.liftingPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadQuotationFilterForm(): void {
    this.quotationPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
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
