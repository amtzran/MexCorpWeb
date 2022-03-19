import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {EmployeeService} from "../../services/employee.service";
import {Product} from "../../../catalog/product/interfaces/product.interface";

@Component({
  selector: 'app-crud-tool',
  templateUrl: './crud-tool.component.html',
})
export class CrudToolComponent implements OnInit {

  /*Formulario*/
  toolForm!: FormGroup;
  /*Titulo Modal*/
  title: string = 'Nueva Herramienta';
  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;
  // Select Products
  products!: Product[];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudToolComponent>,
    private employeeService: EmployeeService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public tool : {data: Product, edit: boolean, info: boolean, idEmployee: number}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadToolForm();
    if(this.tool.data !== 0) this.loadToolById();

    this.employeeService.getProducts().subscribe(products => {this.products = products.data})

    if(this.tool.data !== null && this.tool.edit){
      this.title = 'Editar Cantidad';
      this.toolForm.updateValueAndValidity();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadToolById(): void{
    this.toolForm = this.fb.group({
      product_id:[{value: this.tool.data.id, disabled:this.tool.info}, Validators.required],
      quantity:[{value: this.tool.data.quantity, disabled:this.tool.info,}, Validators.required],
    });
  }

  /**
   * Load the form tool.
   */
  loadToolForm():void{

    this.toolForm = this.fb.group({
      product_id:[{value: '', disabled:this.tool.info}, Validators.required],
      quantity:[{value:'', disabled:this.tool.info,}, Validators.required],
    });
  }


  /**
   * Create Tool By Employee.
   */
  addTool(): void {
    this.validateForm()
    this.spinner.show()
    this.employeeService.addTool(this.tool.idEmployee, this.toolForm.value).subscribe(response => {
        this.spinner.hide()
        this.sharedService.showSnackBar('Se ha agregado correctamente la Herramienta.');
        this.dialogRef.close(ModalResponse.UPDATE);
        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Update a Tool By Employee.
   */
  updateTool(): void {
    this.validateForm()
    this.spinner.show()
    this.employeeService.updateTool(this.tool.data, this.toolForm.value).subscribe(response => {
        this.spinner.hide()
        this.sharedService.showSnackBar(`Se ha actualizado correctamente la herramienta: ${response.data.name}` );
        this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Validate form in general
   */
  validateForm(){
    this.submit = true;
    if(this.toolForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.toolForm.get(field)?.invalid &&
      this.toolForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.CLOSE);
  }

}
