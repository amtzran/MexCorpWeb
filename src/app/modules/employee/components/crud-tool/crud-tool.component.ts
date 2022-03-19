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
    @Inject(MAT_DIALOG_DATA) public tool : {idTool: number, edit: boolean, info: boolean, idEmployee: number}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadToolForm();
    this.employeeService.getProducts().subscribe(products => {this.products = products.data})

    if(this.tool.idTool && this.tool.edit){
      this.title = 'Editar Cantidad';
      this.toolForm.updateValueAndValidity();
    }

    if(this.tool.idTool && !this.tool.edit){
      this.title = 'Información de la Herramienta';
      this.toolForm.updateValueAndValidity();
    }

    if(this.tool.idTool){
      this.loadToolById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadToolById(): void{
    /*this.spinner.show()
    this.employeeService.getContractById(this.contract.idContract).subscribe(response => {
        this.spinner.hide()
        delete response.data.id;
        delete response.data.created_at;
        delete response.data.updated_at;
        delete response.data.is_active;
        this.contractForm.setValue(response.data);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )*/
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
    this.employeeService.updateTool(this.tool.idTool, this.toolForm.value).subscribe(response => {
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
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
