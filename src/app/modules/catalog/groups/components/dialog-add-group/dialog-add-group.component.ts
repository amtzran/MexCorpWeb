import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GroupService} from "../../services/groups.service";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {SharedService} from "../../../../../shared/services/shared.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-dialog-add-group',
  templateUrl: './dialog-add-group.component.html',
  styleUrls: ['./dialog-add-group.component.css']
})
export class DialogAddGroupComponent implements OnInit {

  /*Formulario*/
  groupForm!: FormGroup;
  /* Variable to store file data */
  fileDataForm = new FormData();
  /* Show Image */
  imageFile: string | null | undefined = '';

  /*Titulo Modal*/
  title: string = 'Nuevo Grupo';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<DialogAddGroupComponent>,
    private _groupService: GroupService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public group : {idGroup: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadGroupForm();

    if(this.group.idGroup && this.group.edit){
      this.title = 'Editar Grupo';
      this.imageFile = null;
      this.groupForm.updateValueAndValidity();
    }

    if(this.group.idGroup && !this.group.edit){
      this.title = 'Información del Grupo';
      this._groupService.getGroupById(this.group.idGroup).subscribe(res => { this.imageFile = res.data.logo })
      this.groupForm.updateValueAndValidity();
    }

    if(this.group.idGroup){
      this.loadGroupById();
    }

    this.showSpinner()

  }

  /**
   * Get detail retrieve of one group.
   */
  loadGroupById(): void{
    this._groupService.getGroupById(this.group.idGroup).subscribe(response => {
      delete response.data.id;
      delete response.data.is_active;
      delete response.data.created_at;
      delete response.data.updated_at;
      this.groupForm.setValue(response.data);
    })
  }

  /**
   * Load the form group.
   */
  loadGroupForm():void{
    this.groupForm = this.fb.group({
      name:[{value:null, disabled:this.group.info}, Validators.required],
      reason_social:[{value:'', disabled:this.group.info}, Validators.required],
      rfc:[{value:'', disabled:this.group.info}, Validators.required],
      phone:[{value:'', disabled:this.group.info}],
      email:[{value:'', disabled:this.group.info}, Validators.required],
      address: [{value:'', disabled:this.group.info}],
      city: [{value:'', disabled:this.group.info}],
      postal_code: [{value:'', disabled:this.group.info}],
      logo: [{value:'', disabled:this.group.info}],
    });
  }

  /**
   * Create a group.
   */
  addGroup(): void {
    this.submit = true;
    if(this.groupForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this.createFormData(this.groupForm.value);
    this._groupService.postGroup(this.fileDataForm).subscribe(response => {
      this.showSpinner()
      this.sharedService.showSnackBar('Se ha agregado correctamente el grupo.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a group.
   */
  updateGroup(): void {
    this.submit = true;
    if(this.groupForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this.createFormData(this.groupForm.value)
    this._groupService.updateGroup(this.group.idGroup, this.fileDataForm).subscribe(response => {
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el grupo`);
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /* File onchange event */
  setFileLogo(e : any){
    this.groupForm.get('logo')?.setValue(e.target.files[0])
  }

  createFormData(formValue:any){

    for(const key of Object.keys(formValue)){
      const value = formValue[key];
      if (value !== null) {
        if (key === 'logo') {
          if (typeof(value) !== 'object') {
            if (value.startsWith('https')) this.fileDataForm.append(key, '');
          }
          else this.fileDataForm.append(key, value);
        }
        else {
          this.fileDataForm.append(key, value);
        }
      }

    }

  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.groupForm.get(field)?.invalid &&
      this.groupForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

  showSpinner(){
    this.spinner.show()
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

}
