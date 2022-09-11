import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SharedService} from "../../../../../shared/services/shared.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  /*Form*/
  productForm!: FormGroup;
  /* Variable to store file data */
  fileDataForm = new FormData();
  imageFile: string | null | undefined = '';

  /*Titulo Modal*/
  title: string = 'Nuevo Producto';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public product : {category: string,idProduct: number, edit: boolean, info: boolean, idCustomer: number}
  ) { }

  ngOnInit(): void {
    /*Form*/
    this.imageFile = null
    this.loadProductForm();

    if(this.product.idProduct && this.product.edit){
      this.title = 'Editar Producto';
      this.productForm.updateValueAndValidity();
    }

    if(this.product.idProduct && !this.product.edit){
      this.title = 'Información del Producto';
      this.productService.getProductById(this.product.idProduct).subscribe(
        res => {
          this.imageFile = res.data.photo
          this.spinner.hide()
        },
        (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      );
      this.productForm.updateValueAndValidity();
    }

    if(this.product.idProduct){
      this.loadProductById();
    }

  }

  /**
   * Get detail retrieve of one product.
   */
  loadProductById(): void{
    this.spinner.show()
    this.productService.getProductById(this.product.idProduct).subscribe(response => {
        this.spinner.hide()
        delete response.data.id;
        delete response.data.created_at;
        delete response.data.updated_at;
        this.productForm.setValue(response.data);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
  }

  /**
   * Load the form product.
   */
  loadProductForm():void{
    this.productForm = this.fb.group({
      name:[{value:null, disabled:this.product.info}, Validators.required],
      description:[{value: '', disabled:this.product.info}],
      brand:[{value: '', disabled:this.product.info}],
      cost:[{value: '', disabled:this.product.info}],
      photo: [{value: '', disabled:this.product.info}],
      key: [{value: '', disabled:this.product.info}],
      unit: [{value: '', disabled:this.product.info}],
      category: [{value: this.product.category, disabled:this.product.info}],
    });
    if (this.product.category === 'repair'){
      this.productForm.addControl('model', new FormControl({value: '', disabled: this.product.info}, []))
      this.productForm.addControl('location', new FormControl({value: '', disabled: this.product.info}, []))
      this.productForm.addControl('family', new FormControl({value: '', disabled: this.product.info}, []))
    }
  }

  /**
   * Create product.
   */
  addProduct(): void {
    this.validateForm()
    this.createFormData(this.productForm.value);
    this.spinner.show()
    this.productService.addProduct(this.fileDataForm).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha agregado correctamente el ${response.data.name}`);
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a product.
   */
  updateProduct(): void {
    this.validateForm()
    this.createFormData(this.productForm.value);
    this.spinner.show()
    this.productService.updateProduct(this.product.idProduct, this.fileDataForm).subscribe((response) => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el producto: ${response.data.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /* File onchange event */
  setFileLogo(e : any){
    this.productForm.get('photo')?.setValue(e.target.files[0])
  }

  /**
   * Method convert formGroup a DataForm and wor with files
   * @param formValue
   */
  createFormData(formValue:any){

    for(const key of Object.keys(formValue)){
      const value = formValue[key];
      if (value !== null) {
        if (key === 'photo') {
          if (typeof(value) !== 'object') {
            if (value.startsWith('https')) this.fileDataForm.append(key, '');
          }
          else this.fileDataForm.append(key, value);
        }
        else {
          this.fileDataForm.append(key, value);
        }
      }

    }

  }

  /**
   * Validate form in general
   */
  validateForm(){
    this.submit = true;
    if(this.productForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.productForm.get(field)?.invalid &&
      this.productForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
