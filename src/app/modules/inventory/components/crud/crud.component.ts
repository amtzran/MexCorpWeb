import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {InventoryService} from "../../services/inventory.service";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {Supplier} from "../../../catalog/suppliers/interfaces/suppliers.interface";
import {JobCenter} from "../../../employee/interfaces/employee.interface";
import {MatTableDataSource} from "@angular/material/table";
import {Concept} from "../../interfaces/inventory.interface";
import {MatPaginator} from "@angular/material/paginator";
import {Product} from "../../../catalog/tools-services/interfaces/product.interface";
import {ProductService} from "../../../catalog/tools-services/services/product.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [],
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  form!: FormGroup;
  menuTitle: string = 'Entrada'
  title: string = `Nueva ${this.menuTitle}`;
  showError!: boolean;
  submit!: boolean;
  suppliers!: Supplier[];
  jobCenters!: JobCenter[];
  products!: Product[];
  idConcept!: number;
  type: string = 'add';
  amount: number = 0;
  unitPrice: number = 0;
  total: number = 0;

  displayedColumns: string[] = ['id', 'entrie_id', 'product_name', 'quantity', 'unit_price', 'amount', 'date', 'options'];
  dataSource!: MatTableDataSource<Concept>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  paginateForm!: FormGroup;
  @ViewChild('paginatorConcept', {static: true}) paginatorConcept!: MatPaginator;

  constructor(private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<CrudComponent>,
              private inventoryService: InventoryService,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private productService: ProductService,
              @Inject(MAT_DIALOG_DATA) public entry : {edit: boolean, idEntry: number, info: boolean})
  {
    this.loadDataGroups();
    this.loadDataSuppliers();
  }

  ngOnInit(): void {
    this.loadForm();

    if(this.entry.idEntry && this.entry.edit){
      this.title = `Editar ${this.menuTitle}`;
      this.form.updateValueAndValidity();
    }

    if(this.entry.idEntry && !this.entry.edit){
      this.title = `Información del ${this.menuTitle}`;
      this.form.updateValueAndValidity();
    }

    if(this.entry.idEntry) {
      this.loadProducts();
      this.loadEntryById();
      this.loadConceptFilterForm();
      this.dataSource = new MatTableDataSource();
      this.getConceptsPaginator(this.paginatorConcept);
    }
  }

  /**
   * Load the form Entry.
   */
  loadForm():void{
    this.form = this.formBuilder.group({
      supplier_id:[{value:'', disabled:this.entry.info}, Validators.required],
      job_center_id:[{value:'', disabled:this.entry.info}, Validators.required],
      product_id:[{value:'', disabled:this.entry.info},[]],
      entrie_id:[{value:'', disabled:this.entry.info},[]],
      quantity:[{value:'', disabled:this.entry.info},[]],
      unit_price:[{value:'', disabled:this.entry.info},[]],
    });
  }

  /**
   * Create Comment.
   */
  add(): void {
    this.validateForm()
    this.spinner.show()
    this.inventoryService.addEntry(this.form.value).subscribe((response) => {
        this.spinner.hide()
        this.sharedService.showSnackBar(`Se ha agregado correctamente el ${this.menuTitle}.`);
        this.sharedService.updateComponent();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Get detail retrieve of one group.
   */
  loadEntryById(): void{
    this.spinner.show()
    this.inventoryService.getEntryById(this.entry.idEntry).subscribe((response) => {
      this.total = response.data.total;
      this.form.patchValue({
        supplier_id: response.data.supplier.id,
        job_center_id: response.data.job_center.id,
        entrie_id: this.entry.idEntry
      });
      this.form.get('product_id')?.setValidators([Validators.required]);
      this.form.get('product_id')?.updateValueAndValidity();
      this.form.get('quantity')?.setValidators([Validators.required]);
      this.form.get('quantity')?.updateValueAndValidity();
      this.form.get('unit_price')?.setValidators([Validators.required]);
      this.form.get('unit_price')?.updateValueAndValidity();
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
    this.inventoryService.addConcept(this.form.value).subscribe((response) => {
        this.spinner.hide();
        this.sharedService.showSnackBar(`Se ha agregado correctamente el concepto`);
        this.cleanInputConcept();
        this.sharedService.updateComponent();
        this.getConceptsPaginator(this.paginatorConcept);
        this.loadEntryById();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      }));
  }

  /**
   * update Concept.
   */
  updateConcept(): void {
    this.spinner.show()
    this.inventoryService.updateConcept(this.idConcept, this.form.value).subscribe(response => {
        this.spinner.hide()
        this.sharedService.showSnackBar('Se ha actualizado correctamente el concepto.');
        this.cleanInputConcept();
        this.sharedService.updateComponent();
        this.getConceptsPaginator(this.paginatorConcept);
        this.loadEntryById();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } ))
  }

  /**
   * Delete Concept
   */
  deleteConcept() {
    this.spinner.show()
    this.inventoryService.deleteConcept(this.idConcept)
      .subscribe(response => {
          this.spinner.hide()
          this.sharedService.showSnackBar('Se ha eliminado correctamente el concepto.');
          this.sharedService.updateComponent();
          this.cleanInputConcept();
          this.getConceptsPaginator(this.paginatorConcept);
          this.loadEntryById();
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /**
   *  @param type
   * @param row
   */
  getByIdConcept(type: string, row: Concept) {
    this.spinner.show()
    this.inventoryService.getConceptById(row.id).subscribe((response) => {
          this.idConcept = response.data.id;
          this.type = type;
          this.form.patchValue({
            product_id: response.data.product_id,
            quantity: response.data.quantity,
            unit_price: response.data.unit_price
          });
          this.spinner.hide();
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } ))
  }

  getConceptsPaginator(event: any) {
    const paginatorConcept: MatPaginator = event;
    this.paginateForm.get('page')?.setValue(paginatorConcept.pageIndex + 1);
    this.spinner.show()
    this.inventoryService.getConcepts(this.paginateForm.value)
      .subscribe((concepts) => {
          console.log(concepts)
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
      entrie_id: this.entry.idEntry,
    })
  }

  /**
   * Array from service for Groups
   */
  loadDataGroups(){
    this.inventoryService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
  }

  /**
   * Array from service for Suppliers
   */
  loadDataSuppliers(){
    this.inventoryService.getSuppliers().subscribe(suppliers => {this.suppliers = suppliers.data} )
  }

  /**
   * Array from service for Groups
   */
  loadProducts(): void {
    this.inventoryService.getProductsAll().subscribe(products => {this.products = products.data} )
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
