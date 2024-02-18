import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {InventoryService} from "../../services/inventory.service";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {JobCenter} from "../../../employee/interfaces/employee.interface";
import {MatTableDataSource} from "@angular/material/table";
import {Concept, OutputConcept} from "../../interfaces/inventory.interface";
import {MatPaginator} from "@angular/material/paginator";
import {Product} from "../../../catalog/tools-services/interfaces/product.interface";
import {ProductService} from "../../../catalog/tools-services/services/product.service";

@Component({
  selector: 'app-crud-output',
  templateUrl: './crud-output.component.html',
  styleUrls: ['./crud-output.component.css']
})
export class CrudOutputComponent implements OnInit {

  /*Formulario*/
  form!: FormGroup;
  menuTitle: string = 'Salida'
  title: string = `Nueva ${this.menuTitle}`;
  showError!: boolean;
  submit!: boolean;
  jobCenters!: JobCenter[];
  products!: Product[];
  type: string = 'add';
  amount: number = 0;
  total: number = 0;
  idConcept!: number;
  idOutput!: number;

  displayedColumns: string[] = ['id', 'product_name', 'quantity', 'unit_price', 'amount', 'date', 'options'];
  dataSource!: MatTableDataSource<OutputConcept>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  paginateForm!: FormGroup;
  @ViewChild('paginatorConcept', {static: true}) paginatorConcept!: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudOutputComponent>,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public output : {edit: boolean, idOutput: number, info: boolean})
  {
    this.loadDataGroups();
  }

  ngOnInit(): void {
    this.loadForm();
    this.idOutput = this.output.idOutput;
    this.loadConceptFilterForm();
    this.dataSource = new MatTableDataSource();

    if(this.idOutput && this.output.edit){
      this.title = `Editar ${this.menuTitle}`;
      this.form.updateValueAndValidity();
    }

    if(this.idOutput && !this.output.edit){
      this.title = `Información del ${this.menuTitle}`;
      this.form.updateValueAndValidity();
    }

    if(this.idOutput) {
      this.loadOutputById();
      this.getConceptsPaginator(this.paginatorConcept);
    }
  }

  /**
   * Load the form Output.
   */
  loadForm():void{
    this.form = this.formBuilder.group({
      destination:[{value:'', disabled:this.output.info}, Validators.required],
      job_center_id:[{value:'', disabled:this.output.info}, Validators.required],
      product_id:[{value:'', disabled:this.output.info},[]],
      output_id:[{value:'', disabled:this.output.info},[]],
      quantity:[{value:'', disabled:this.output.info},[]],
      unit_price:[{value:'', disabled:this.output.info},[]],
    });
  }

  /**
   * Create Output.
   */
  add(): void {
    this.validateForm()
    this.spinner.show()
    this.inventoryService.addOutput(this.form.value).subscribe((response) => {
        this.idOutput = response.data.id;
        this.form.get('output_id')?.setValue(this.idOutput);
        this.spinner.hide()
        this.sharedService.showSnackBar(`Se ha agregado correctamente el ${this.menuTitle}.`);
        this.sharedService.updateComponent();
        this.cleanInputConcept();
        this.loadOutputByIdNew(this.idOutput);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Get detail retrieve of one group.
   */
  loadOutputByIdNew(id: number): void{
    this.spinner.show()
    this.inventoryService.getOutputById(id).subscribe((response) => {
      this.total = response.data.total;
      this.validateInput();
      this.loadProducts();
      this.spinner.hide();
    }, (error => {
      this.spinner.hide()
      this.sharedService.errorDialog(error)
    }))
  }

  /**
   * Get detail retrieve of one group.
   */
  loadOutputById(): void {
    this.spinner.show()
    this.inventoryService.getOutputById(this.idOutput).subscribe((response) => {
      this.total = response.data.total;
      this.form.patchValue({
        job_center_id: response.data.job_center.id,
        destination: response.data.destination,
        output_id: this.idOutput
      });
      this.loadProducts()
      this.validateInput();
      this.spinner.hide();
    }, (error => {
      this.spinner.hide()
      this.sharedService.errorDialog(error)
    }))
  }

  /**
   * Update a comment.
   */
  saveConcept(): void {
    this.validateForm()
    this.spinner.show()
    this.inventoryService.addOutputConcept(this.form.value).subscribe((response) => {
        this.spinner.hide();
        this.sharedService.showSnackBar(`Se ha agregado correctamente el concepto`);
        this.cleanInputConcept();
        this.sharedService.updateComponent();
        this.getConceptsPaginator(this.paginatorConcept);
        this.loadOutputById();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      }));
  }

  /**
   * Delete Concept
   */
  deleteConcept(type: string, row: Concept) {
    this.spinner.show()
    this.inventoryService.deleteOutputConcept(row.id)
      .subscribe(response => {
          this.spinner.hide()
          this.sharedService.showSnackBar('Se ha eliminado correctamente el concepto.');
          this.sharedService.updateComponent();
          this.cleanInputConcept();
          this.getConceptsPaginator(this.paginatorConcept);
          this.loadOutputById();
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } ))
  }

  getConceptsPaginator(event: any) {
    this.spinner.show()
    if (event !== undefined) {
      const paginatorConcept: MatPaginator = event;
      this.paginateForm.get('page')?.setValue(paginatorConcept.pageIndex + 1);
    }
    if (!this.output.idOutput) this.paginateForm.get('output_id')?.setValue(this.idOutput);
    this.inventoryService.getOutputConcepts(this.paginateForm.value)
      .subscribe((concepts) => {
          this.spinner.hide()
          this.dataSource.data = concepts.data
          this.totalItems = concepts.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } ))
  }

  /**
   * Event set Data Product
   * @param idProduct
   */
  setDataProduct(idProduct: number){
    if (idProduct !== undefined) {
      this.productService.getProductById(idProduct).subscribe(product =>{
        this.form.patchValue({unit_price: product.data.cost});
      })
    }
  }

  /**
   * Celen inputs concepts
   */
  cleanInputConcept() {
    this.type = 'add';
    this.form.get('product_id')?.setValue('');
    this.form.get('quantity')?.setValue('');
    this.form.get('unit_price')?.setValue('');
  }

  validateInput() {
    this.form.get('product_id')?.setValidators([Validators.required]);
    this.form.get('product_id')?.updateValueAndValidity();
    this.form.get('quantity')?.setValidators([Validators.required]);
    this.form.get('quantity')?.updateValueAndValidity();
    this.form.get('unit_price')?.setValidators([Validators.required]);
    this.form.get('unit_price')?.updateValueAndValidity();
  }

  /**
   * Validate form in general
   */
  validateForm(){
    this.submit = true;
    if(this.form.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Upload Data Table
   */
  loadConceptFilterForm(): void {
    this.paginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize],
      output_id: this.idOutput,
    })
  }

  /**
   * Array from service for Groups
   */
  loadDataGroups(){
    this.inventoryService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
  }

  /**
   * Array from service for Products
   */
  loadProducts(): void {
    this.inventoryService.getRepairsAll().subscribe(products => {this.products = products.data} )
  }

  /**
   * Event OnChange for get id Select
   * @param event
   */
  selectJobCenter(event: any) {
    //this.loadProducts(event);
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.CLOSE);
  }

}
