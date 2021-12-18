import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {CustomerTypeService} from "../../services/customer-type.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  customerTypeForm!: FormGroup;

  /*Titulo Modal*/
  title: string = 'Nuevo Tipo de Cliente';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _customerTypeService: CustomerTypeService,
    @Inject(MAT_DIALOG_DATA) public customerType : {idCustomerType: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadCustomerTypeForm();

    if(this.customerType.idCustomerType && this.customerType.edit){
      this.title = 'Editar Tipo de Cliente';
      this.customerTypeForm.updateValueAndValidity();
    }

    if(this.customerType.idCustomerType && !this.customerType.edit){
      this.title = 'Información del Tipo de Cliente';
      this.customerTypeForm.updateValueAndValidity();
    }

    if(this.customerType.idCustomerType){
      this.loadCustomerById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadCustomerById(): void{
    this._customerTypeService.getCustomerTypeById(this.customerType.idCustomerType).subscribe(response => {
      delete response.id;
      delete response.created_at;
      delete response.updated_at;
      this.customerTypeForm.setValue(response);
    })
  }

  /**
   * Load the form group.
   */
  loadCustomerTypeForm():void{
    this.customerTypeForm = this.fb.group({
      name:[{value:null, disabled:this.customerType.info}, Validators.required],
      description:[{value:null, disabled:this.customerType.info}],
    });
  }

  /**
   * Create employee.
   */
  addCustomerType(): void {
    this.submit = true;
    if(this.customerTypeForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._customerTypeService.addCustomerType(this.customerTypeForm.value).subscribe(response => {
      this.showSnackBar('Se ha agregado correctamente el tipo de Cliente.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a employee.
   */
  updateCustomerType(): void {
    this.submit = true;
    if(this.customerTypeForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._customerTypeService.updateCustomerType(this.customerType.idCustomerType, this.customerTypeForm.value).subscribe(response => {
      this.showSnackBar(`Se ha actualizado correctamente el tipo de Cliente: ${response.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

  /**
   * Generate new snack bar with custom message.
   * @param msg
   */
  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000
    })
  }

}
