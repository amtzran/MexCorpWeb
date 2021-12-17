import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {CustomerServiceService} from "../../services/customer-service.service";
import {Contract, TypeCustomer} from "../../interfaces/customer.interface";

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
    private snackBar: MatSnackBar,
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
      reason_social:[{value:null, disabled:this.customer.info}],
      rfc:[{value:null, disabled:this.customer.info}],
      phone:[{value:null, disabled:this.customer.info}],
      email:[{value:null, disabled:this.customer.info}],
      address: [{value:null, disabled:this.customer.info}],
      city: [{value:null, disabled:this.customer.info}],
      postal_code: [{value:null, disabled:this.customer.info}],
      contract: [{value: 0, disabled:this.customer.info}],
      customer_type: [{value: 0, disabled:this.customer.info}],
      user: [{value: 1 , disabled:this.customer.info}]
    });
  }

  /**
   * Create a customer.
   */
  addCustomer(): void {
    this.submit = true;
    if(this.customerForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._customerService.addCustomer(this.customerForm.value).subscribe(response => {
      this.showSnackBar('Se ha agregado correctamente el customer.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a customer.
   */
  updateCustomer(): void {
    this.submit = true;
    if(this.customerForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._customerService.updateCustomer(this.customer.idCustomer, this.customerForm.value).subscribe(response => {
      this.showSnackBar(`Se ha actualizado correctamente el cliente: ${response.name}` );
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
