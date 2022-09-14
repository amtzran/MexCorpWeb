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
import {Concept, Entry} from "../../interfaces/inventory.interface";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
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

  displayedColumns: string[] = ['id', 'entrie_id', 'product_name', 'quantity', 'unit_price', 'date', 'options'];
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
   * Update a comment.
   */
  update(): void {
    console.log(this.form.value)
   /* this.validateForm()
    this.spinner.show()
    this.inventoryService.updateEntry(this.entry.idEntry, this.form.value).subscribe((response) => {
        this.spinner.hide();
        this.sharedService.showSnackBar(`Se ha actualizado correctamente el ${this.menuTitle}` );
        this.sharedService.updateComponent();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      }))*/
  }

  /**
   * Get detail retrieve of one group.
   */
  loadEntryById(): void{
    this.spinner.show()
    this.inventoryService.getEntryById(this.entry.idEntry).subscribe((response) => {
        this.form.patchValue({
          supplier_id: response.data.supplier.id,
          job_center_id: response.data.job_center.id
        });
      this.form.addControl('entrie_id', new FormControl({value: '', disabled: this.entry.info}, []));
      this.form.addControl('product_id', new FormControl({value: '', disabled: this.entry.info}, [Validators.required]));
      this.form.addControl('quantity', new FormControl({value: '', disabled: this.entry.info}, []));
      this.form.addControl('unit_price', new FormControl({value: '', disabled: this.entry.info}, []));
      this.spinner.hide();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      }))
  }

  getConceptsPaginator(event: any) {
    const paginatorConcept: MatPaginator = event;
    console.log(this.paginateForm.value)
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
   * Array from service for Groups
   */
  loadDataSuppliers(){
    this.inventoryService.getSuppliers().subscribe(suppliers => {this.suppliers = suppliers.data} )
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
