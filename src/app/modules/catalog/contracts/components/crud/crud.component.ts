import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {ContractService} from "../../services/contract.service";
import {SharedService} from "../../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";

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
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
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
    this.spinner.show()
    this._contractService.getContractById(this.contract.idContract).subscribe(response => {
      this.spinner.hide()
      delete response.data.id;
      delete response.data.created_at;
      delete response.data.updated_at;
      delete response.data.is_active;
      this.contractForm.setValue(response.data);
    }, (error => {
      this.spinner.hide()
      this.sharedService.errorDialog()
    } )
    )
  }

  /**
   * Load the form group.
   */
  loadContractForm():void{
    this.contractForm = this.fb.group({
      name:[{value:null, disabled:this.contract.info}, Validators.required],
      description:[{value:'', disabled:this.contract.info}],
    });
  }

  /**
   * Create Contract.
   */
  addContract(): void {
    this.validateForm()
    this.spinner.show()
    this._contractService.addContract(this.contractForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar('Se ha agregado correctamente el convenio.');
      this.dialogRef.close(ModalResponse.UPDATE);
        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog()
      })
    )
  }

  /**
   * Update a Contract.
   */
  updateContract(): void {
   this.validateForm()
    this.spinner.show()
    this._contractService.updateContract(this.contract.idContract, this.contractForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el convenio: ${response.data.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog()
      })
    )
  }

  /**
   * Validate form in general
   */
  validateForm(){
    this.submit = true;
    if(this.contractForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
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

}
