import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LiftingService} from "../../services/lifting.service";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Quotation, QuotationConcept} from "../../interfaces/lifting.interface";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-concept',
  templateUrl: './concept.component.html',
  styleUrls: ['./concept.component.css']
})
export class ConceptComponent implements OnInit {

  title: string = 'Cotización';
  dateQuote: string = '';
  folio: string | undefined = '';
  amount: number | string = '';
  discount: number | string = '';
  subTotal: number | string = '';
  tax: number | string = '';
  total: number | string = '';
  idConcept: number | string | undefined = '';
  conceptForm!: FormGroup;
  conceptPaginateForm!: FormGroup;
  discountForm!: FormGroup;

  displayedColumns: string[] = ['id', 'quantity', 'unit', 'key', 'brand', 'tax', 'unit_price', 'amount', 'options'];
  dataSource!: MatTableDataSource<QuotationConcept>;
  @ViewChild('paginator', {static: true}) paginator!: MatPaginator;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;

  constructor(private dialogRef: MatDialogRef<ConceptComponent>,
              private liftingService: LiftingService,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public quotation : {row: Quotation}) { }

  ngOnInit(): void {
    this.loadDataQuote()
    this.loadConceptForm();
    this.loadConceptFilterForm();
    this.loadDiscountForm();
    this.dataSource = new MatTableDataSource();
    this.getConceptsPaginator(this.paginator);
  }

  /**
   * Load the form lifting.
   */
  loadConceptForm():void{
    this.conceptForm = this.formBuilder.group({
      quote_id:[{value: this.quotation.row.id, disabled:false},],
      quantity:[{value: '', disabled:false}, Validators.required],
      unit:[{value: '', disabled:false}, Validators.required],
      key:[{value: '', disabled:false}, Validators.required],
      brand:[{value: '', disabled:false},],
      description:[{value: '', disabled:false}, Validators.required],
      tax:[{value: 16, disabled:false}, Validators.required],
      unit_price:[{value: '', disabled:false}, Validators.required],
    });
  }

  /**
   * Load the form lifting.
   */
  loadDiscountForm():void{
    this.discountForm = this.formBuilder.group({
      discount:[{value: this.quotation.row.discount, disabled:false}, Validators.required],
    });
  }

  // Data Quote General
  dataQuoteGeneral() {
    this.liftingService.getQuoteById(this.quotation.row.id).subscribe(response => {
        this.amount = response.data.amount;
        this.discount = response.data.discount;
        this.subTotal = response.data.subtotal;
        this.tax = response.data.tax;
        this.total = response.data.total;
      }, (error => {
        this.sharedService.errorDialog(error)
      } )
    )
  }

  // Data Quote
  loadDataQuote() {
    this.dateQuote = this.quotation.row.date;
    this.folio = this.quotation.row.folio;
    this.amount = this.quotation.row.amount;
    this.discount = this.quotation.row.discount;
    this.subTotal = this.quotation.row.subtotal;
    this.tax = this.quotation.row.tax;
    this.total = this.quotation.row.total;
  }

  /**
   * Create Concept.
   */
  addConcept(): void {
    this.spinner.show()
    this.liftingService.addConcept(this.conceptForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar('Se ha agregado correctamente el concepto.');
      this.getConceptsPaginator(this.paginator);
      this.conceptForm.reset();
      this.conceptForm.get('quote_id')?.setValue(this.quotation.row.id);
      this.conceptForm.get('tax')?.setValue(16);
      this.dataQuoteGeneral()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
  }

  /**
   * update Concept.
   */
  updateConcept(): void {
    this.spinner.show()
    this.liftingService.updateConcept(this.idConcept, this.conceptForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar('Se ha actualizado correctamente el concepto.');
      this.getConceptsPaginator(this.paginator);
      this.conceptForm.reset();
      this.conceptForm.get('quote_id')?.setValue(this.quotation.row.id);
      this.conceptForm.get('tax')?.setValue(16);
      this.dataQuoteGeneral()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
  }

  /**
   * update Concept.
   */
  updateDiscount() {
    this.liftingService.updateDiscount(this.quotation.row.id, this.discountForm.value).subscribe(response => {
        this.discount = response.data.discount;
        this.amount = response.data.amount;
        this.subTotal = response.data.subtotal;
        this.tax = response.data.tax;
        this.total = response.data.total;
      }, (error => {
        this.sharedService.errorDialog(error)
      } )
    )
  }

  getConceptsPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.conceptPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.liftingService.getConceptQuotes(this.conceptPaginateForm.value)
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

  /* Método que permite iniciar los filtros de rutas*/
  loadConceptFilterForm(): void {
    this.conceptPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize],
      quote_id: this.quotation.row.id
    })
  }

  /**
   *
   * @param row
   */
  getByIdConcept(row: QuotationConcept) {
    this.spinner.show()
    this.liftingService.getConceptQuoteById(row.id)
      .subscribe(response => {
          this.spinner.hide()
          this.idConcept = response.data.id;
          delete response.data.id
          delete response.data.amount;
          delete response.data.updated_at;
          delete response.data.created_at;
          this.conceptForm.setValue(response.data);
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /**
   *
   * @param row
   */
  deleteConcept(row: QuotationConcept) {
    this.spinner.show()
    this.liftingService.deleteConcept(row.id)
      .subscribe(response => {
          this.spinner.hide()
          this.sharedService.showSnackBar('Se ha eliminado correctamente el concepto.');
          this.getConceptsPaginator(this.paginator);
          this.dataQuoteGeneral()
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /**
   * Clean Fields
   */
  cancelConcept() {
    this.conceptForm.reset();
    this.conceptForm.get('quote_id')?.setValue(this.quotation.row.id);
    this.conceptForm.get('tax')?.setValue(16);
    this.idConcept = '';
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.conceptForm.get(field)?.invalid &&
      this.conceptForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.sharedService.updateComponent();
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
