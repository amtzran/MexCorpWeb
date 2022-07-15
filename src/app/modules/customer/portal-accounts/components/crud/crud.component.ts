import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedService} from "../../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {PortalAccountService} from "../../services/portal-account.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  accountForm!: FormGroup;
  /*Titulo Modal*/
  menuTitle: string = 'Cuenta Portal'
  title: string = `Nueva ${this.menuTitle}`;
  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudComponent>,
    private portalAccountService: PortalAccountService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public portalAccount : {idPortalAccount: number, edit: boolean, info: boolean, idCustomer: number}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadPortalAccountForm();

    if(this.portalAccount.idPortalAccount && this.portalAccount.edit){
      this.title = `Editar ${this.menuTitle}`;
      this.accountForm.updateValueAndValidity();
    }

    if(this.portalAccount.idPortalAccount && !this.portalAccount.edit){
      this.title = `Información de la ${this.menuTitle}`;
      this.accountForm.updateValueAndValidity();
    }

    if(this.portalAccount.idPortalAccount){
      this.loadContractById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadContractById(): void{
    this.spinner.show()
    this.portalAccountService.getPortalAccountById(this.portalAccount.idPortalAccount).subscribe(response => {
        this.spinner.hide()
        delete response.data.id;
        delete response.data.created_at;
        delete response.data.updated_at;
        this.accountForm.patchValue({
          name: response.data.name,
          username: response.data.username,
          is_active: response.data.is_active,
          password : '********',
        });
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Load the form group.
   */
  loadPortalAccountForm():void{
    this.accountForm = this.fb.group({
      name:[{value:'', disabled:this.portalAccount.info}, Validators.required],
      username:[{value:'', disabled:this.portalAccount.info}, Validators.required],
      password:[{value:'', disabled:this.portalAccount.info}, Validators.required],
      is_active:[{value: true, disabled:this.portalAccount.info},],
      customer_id: [{value: this.portalAccount.idCustomer, disabled:this.portalAccount.info}]
    });
  }

  /**
   * Create Contact.
   */
  addPortalAccount(): void {
    this.validateForm()
    this.spinner.show()
    this.portalAccountService.addPortalAccount(this.accountForm.value).subscribe(response => {
        this.spinner.hide()
        this.sharedService.showSnackBar(`Se ha agregado correctamente el ${this.menuTitle}.`);
        this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Update a contact.
   */
  updatePortalAccount(): void {
    this.validateForm();
    this.spinner.show();
    this.portalAccountService.updatePortalAccount(this.portalAccount.idPortalAccount, this.accountForm.value).subscribe(response => {
        this.spinner.hide()
        this.sharedService.showSnackBar(`Se ha actualizado correctamente el ${this.menuTitle}: ${response.data.name}` );
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
    if (this.accountForm.value.password === '********') this.accountForm.removeControl('password');
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.accountForm.get(field)?.invalid && this.accountForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
