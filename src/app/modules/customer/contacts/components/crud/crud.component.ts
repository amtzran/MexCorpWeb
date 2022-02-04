import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {ContactService} from "../../services/contact.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  contactForm!: FormGroup;

  /*Titulo Modal*/
  menuTitle: string = 'Contacto'
  title: string = `Nuevo ${this.menuTitle}`;

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _contactService: ContactService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public contact : {idContact: number, edit: boolean, info: boolean, idCustomer: number}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadContractForm();

    if(this.contact.idContact && this.contact.edit){
      this.title = `Editar ${this.menuTitle}`;
      this.contactForm.updateValueAndValidity();
    }

    if(this.contact.idContact && !this.contact.edit){
      this.title = `Información del ${this.menuTitle}`;
      this.contactForm.updateValueAndValidity();
    }

    if(this.contact.idContact){
      this.loadContractById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadContractById(): void{
    this.spinner.show()
    this._contactService.getContactById(this.contact.idContact).subscribe(response => {
      this.spinner.hide()
      delete response.data.id;
      delete response.data.created_at;
      delete response.data.updated_at;
      this.contactForm.setValue(response.data);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Load the form group.
   */
  loadContractForm():void{
    this.contactForm = this.fb.group({
      name:[{value:'', disabled:this.contact.info}, Validators.required],
      phone:[{value:'', disabled:this.contact.info}],
      job_title:[{value:'', disabled:this.contact.info}],
      email:[{value:null, disabled:this.contact.info}, Validators.email],
      department:[{value:'', disabled:this.contact.info}],
      customer_id: [{value: this.contact.idCustomer, disabled:this.contact.info}]
    });
  }

  /**
   * Create Contact.
   */
  addContact(): void {
    this.validateForm()
    this.spinner.show()
    this._contactService.addContact(this.contactForm.value).subscribe(response => {
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
  updateContact(): void {
    this.validateForm()
    this.spinner.show()
    this._contactService.updateContact(this.contact.idContact, this.contactForm.value).subscribe(response => {
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
    this.submit = true;
    if(this.contactForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.contactForm.get(field)?.invalid && this.contactForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
