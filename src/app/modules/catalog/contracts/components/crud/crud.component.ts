import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EmployeeService} from "../../../../employee/services/employee.service";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {ContractService} from "../../services/contract.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  contractForm!: FormGroup;

  /*Titulo Modal*/
  title: string = 'Nuevo Convenio';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public contract : {idContract: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadContractForm();

    if(this.contract.idContract && this.contract.edit){
      this.title = 'Editar Convenio';
      this.contractForm.updateValueAndValidity();
    }

    if(this.contract.idContract && !this.contract.edit){
      this.title = 'Información del Convenio';
      this.contractForm.updateValueAndValidity();
    }

    if(this.contract.idContract){
      this.loadContractById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadContractById(): void{
    this._contractService.getContractById(this.contract.idContract).subscribe(response => {
      delete response.id;
      delete response.created_at;
      delete response.updated_at;
      this.contractForm.setValue(response);
    })
  }

  /**
   * Load the form group.
   */
  loadContractForm():void{
    this.contractForm = this.fb.group({
      name:[{value:null, disabled:this.contract.info}, Validators.required],
      description:[{value:null, disabled:this.contract.info}],
    });
  }

  /**
   * Create employee.
   */
  addContract(): void {
    this.submit = true;
    if(this.contractForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._contractService.addContract(this.contractForm.value).subscribe(response => {
      this.showSnackBar('Se ha agregado correctamente el convenio.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a employee.
   */
  updateContract(): void {
    this.submit = true;
    if(this.contractForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._contractService.updateContract(this.contract.idContract, this.contractForm.value).subscribe(response => {
      this.showSnackBar(`Se ha actualizado correctamente el convenio: ${response.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.contractForm.get(field)?.invalid &&
      this.contractForm.get(field)?.touched
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
