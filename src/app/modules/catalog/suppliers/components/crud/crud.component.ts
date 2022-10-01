import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ContractService} from "../../../contracts/services/contract.service";
import {SharedService} from "../../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {SupplierService} from "../../services/supplier.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Form*/
  supplierForm!: FormGroup;
  title: string = 'Nuevo Proveedor';
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudComponent>,
    private supplierService: SupplierService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public supplier : {idSupplier: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadContractForm();

    if(this.supplier.idSupplier && this.supplier.edit){
      this.title = 'Editar Proveedor';
      this.supplierForm.updateValueAndValidity();
    }

    if(this.supplier.idSupplier && !this.supplier.edit){
      this.title = 'Información del Proveedor';
      this.supplierForm.updateValueAndValidity();
    }

    if(this.supplier.idSupplier){
      this.loadContractById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadContractById(): void{
    this.spinner.show()
    this.supplierService.getSupplierById(this.supplier.idSupplier).subscribe(response => {
        this.spinner.hide()
        delete response.data.id;
        delete response.data.created_at;
        delete response.data.updated_at;
        this.supplierForm.setValue(response.data);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
  }

  /**
   * Load the form group.
   */
  loadContractForm():void{
    this.supplierForm = this.fb.group({
      name:[{value:null, disabled:this.supplier.info}, Validators.required],
      description:[{value:null, disabled:this.supplier.info}, ],
    });
  }

  /**
   * Create Contract.
   */
  addContract(): void {
    this.validateForm()
    this.spinner.show()
    this.supplierService.addSupplier(this.supplierForm.value).subscribe(response => {
        this.spinner.hide()
        this.sharedService.showSnackBar('Se ha agregado correctamente el proveedor.');
        this.dialogRef.close(ModalResponse.UPDATE);
        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Update a Contract.
   */
  updateContract(): void {
    this.validateForm()
    this.spinner.show()
    this.supplierService.updateSupplier(this.supplier.idSupplier, this.supplierForm.value).subscribe(response => {
        this.spinner.hide()
        this.sharedService.showSnackBar(`Se ha actualizado correctamente el proveedor: ${response.data.name}` );
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
    if(this.supplierForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.supplierForm.get(field)?.invalid &&
      this.supplierForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
