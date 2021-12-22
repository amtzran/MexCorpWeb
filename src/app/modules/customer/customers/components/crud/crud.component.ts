import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {CustomerServiceService} from "../../services/customer-service.service";
import {Contract, TypeCustomer} from "../../interfaces/customer.interface";
import {SharedService} from "../../../../../shared/services/shared.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  customerForm!: FormGroup;

  /*Titulo Modal*/
  title: string = 'Nuevo Cliente';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  // Fill Selects Contracts and Type customer
  contracts: Contract[] = [];
  typeCustomers: TypeCustomer[] = []

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _customerService: CustomerServiceService,
    @Inject(MAT_DIALOG_DATA) public customer : {idCustomer: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    // Contracts init
    this._customerService.getContracts()
      .subscribe(contracts => {
        this.contracts = contracts.results
      } )

    // Type Customers
    this._customerService.getTypeCustomers()
      .subscribe(typeCustomers => {
        this.typeCustomers = typeCustomers.results
      } )

    /*Formulario*/
    this.loadCustomerForm();

    if(this.customer.idCustomer && this.customer.edit){
      this.title = 'Editar Cliente';
      this.customerForm.updateValueAndValidity();
    }

    if(this.customer.idCustomer && !this.customer.edit){
      this.title = 'Información del Cliente';
      this.customerForm.updateValueAndValidity();
    }

    if(this.customer.idCustomer){
      this.loadGroupById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadGroupById(): void{
    this._customerService.getCustomerById(this.customer.idCustomer).subscribe(response => {
      delete response.id;
      delete response.created_at;
      delete response.updated_at;
      this.customerForm.setValue(response);
    })
  }

  /**
   * Load the form group.
   */
  loadCustomerForm():void{
    this.customerForm = this.fb.group({
      name:[{value:null, disabled:this.customer.info}, Validators.required],
      reason_social:[{value:'', disabled:this.customer.info}],
      rfc:[{value:'', disabled:this.customer.info}],
      phone:[{value:'', disabled:this.customer.info}],
      email:[{value:'', disabled:this.customer.info}],
      address: [{value:'', disabled:this.customer.info}],
      city: [{value:'', disabled:this.customer.info}],
      postal_code: [{value:'', disabled:this.customer.info}],
      contract: [{value: '', disabled:this.customer.info}, Validators.required],
      customer_type: [{value: '', disabled:this.customer.info}, Validators.required],
      user: [{value: 1 , disabled:this.customer.info}]
    });
  }

  /**
   * Create a customer.
   */
  addCustomer(): void {
    this.submit = true;
    if(this.customerForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._customerService.addCustomer(this.customerForm.value).subscribe(response => {
      this.sharedService.showSnackBar('Se ha agregado correctamente el customer.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a customer.
   */
  updateCustomer(): void {
    this.submit = true;
    if(this.customerForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._customerService.updateCustomer(this.customer.idCustomer, this.customerForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el cliente: ${response.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.customerForm.get(field)?.invalid &&
      this.customerForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
