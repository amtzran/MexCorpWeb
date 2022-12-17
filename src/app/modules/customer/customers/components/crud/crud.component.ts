import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {CustomerServiceService} from "../../services/customer-service.service";
import {Contract, TypeCustomer} from "../../interfaces/customer.interface";
import {SharedService} from "../../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DateService} from "../../../../../core/utils/date.service";

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
  startDate: string = '';
  endDate: string = '';

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _customerService: CustomerServiceService,
    private spinner: NgxSpinnerService,
    private dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public customer : {idCustomer: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    // Contracts init
    this._customerService.getContracts()
      .subscribe(contracts => {
        this.contracts = contracts.data
      } )

    // Type Customers
    this._customerService.getTypeCustomers()
      .subscribe(typeCustomers => {
        this.typeCustomers = typeCustomers.data
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
    this.spinner.show()
    this._customerService.getCustomerById(this.customer.idCustomer).subscribe((response) => {
      this.spinner.hide()
      let dateStart = null;
      if (response.data.date_start_agreement !== null) {
        dateStart = this.dateService.getFormatDateSetInputRangePicker(response.data.date_start_agreement!)
      }
      let dateEnd = null;
      if (response.data.date_end_agreement !== null) {
        dateEnd = this.dateService.getFormatDateSetInputRangePicker(response.data.date_end_agreement!)
      }

      this.customerForm.patchValue({
        address: response.data.address,
        city: response.data.city,
        contract_id: response.data.contract_id,
        customer_type_id: response.data.customer_type_id,
        date_end_agreement: dateEnd,
        date_start_agreement: dateStart,
        email: response.data.email,
        name: response.data.name,
        phone: response.data.phone,
        postal_code: response.data.postal_code,
        reason_social: response.data.reason_social,
        rfc: response.data.rfc
      })
      //this.customerForm.setValue(response.data);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
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
      email:[{value:null, disabled:this.customer.info}, Validators.email],
      address: [{value:'', disabled:this.customer.info}],
      city: [{value:'', disabled:this.customer.info}],
      postal_code: [{value:'', disabled:this.customer.info}],
      date_start_agreement: [{value: null, disabled:this.customer.info}],
      date_end_agreement: [{value: null, disabled:this.customer.info}],
      contract_id: [{value: '', disabled:this.customer.info}, Validators.required],
      customer_type_id: [{value: '', disabled:this.customer.info}, Validators.required],
    });
  }

  /**
   * Create a customer.
   */
  addCustomer(): void {
    this.validateForm()
    this.spinner.show()
    this._customerService.addCustomer(this.customerForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar('Se ha agregado correctamente el customer.');
      this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Update a customer.
   */
  updateCustomer(): void {
    this.validateForm()
    this.spinner.show()
    this._customerService.updateCustomer(this.customer.idCustomer, this.customerForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el cliente: ${response.data.name}` );
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
    if(this.customerForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    if (this.customerForm.value.date_start_agreement !== null)
    {
      this.startDate = this.dateService.getFormatDataDate(this.customerForm.get('date_start_agreement')?.value)
      this.customerForm.get('date_start_agreement')?.setValue(this.startDate)
    }
    else this.customerForm.get('date_start_agreement')?.setValue(null);

    if (this.customerForm.value.date_end_agreement !== null)
    {
    this.endDate = this.dateService.getFormatDataDate(this.customerForm.get('date_end_agreement')?.value)
    this.customerForm.get('date_end_agreement')?.setValue(this.endDate)
    }
    else this.customerForm.get('date_end_agreement')?.setValue(null);

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
    this.dialogRef.close(ModalResponse.CLOSE);
  }

}
