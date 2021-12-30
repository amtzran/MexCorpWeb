import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {CustomerTypeService} from "../../services/customer-type.service";
import {SharedService} from "../../../../../shared/services/shared.service";

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
    private sharedService: SharedService,
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
      delete response.data.id;
      delete response.data.is_active;
      delete response.data.created_at;
      delete response.data.updated_at;
      this.customerTypeForm.setValue(response.data);
    })
  }

  /**
   * Load the form group.
   */
  loadCustomerTypeForm():void{
    this.customerTypeForm = this.fb.group({
      name:[{value:null, disabled:this.customerType.info}, Validators.required],
      description:[{value:'', disabled:this.customerType.info}],
    });
  }

  /**
   * Create employee.
   */
  addCustomerType(): void {
    this.submit = true;
    if(this.customerTypeForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._customerTypeService.addCustomerType(this.customerTypeForm.value).subscribe(response => {
      this.sharedService.showSnackBar('Se ha agregado correctamente el tipo de Cliente.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a employee.
   */
  updateCustomerType(): void {
    this.submit = true;
    if(this.customerTypeForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._customerTypeService.updateCustomerType(this.customerType.idCustomerType, this.customerTypeForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el tipo de Cliente: ${response.data.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.customerTypeForm.get(field)?.invalid &&
      this.customerTypeForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
