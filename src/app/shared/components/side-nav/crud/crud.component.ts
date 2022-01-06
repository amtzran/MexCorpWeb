import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProfileUser} from "../../../../modules/auth/interfaces/login.interface";
import {SharedService} from "../../../services/shared.service";
import {AuthServiceService} from "../../../../modules/auth/services/auth-service.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  profileForm!: FormGroup;
  nameProfileForm!: FormGroup;

  /*Titulo Modal*/
  title: string = 'Usuario';
  hide = true;
  submit!: boolean;

  constructor(private dialogRef: MatDialogRef<CrudComponent>,
              private fb: FormBuilder,
              private sharedService: SharedService,
              private authService: AuthServiceService,
              @Inject(MAT_DIALOG_DATA) public data : ProfileUser
              ) { }

  ngOnInit(): void {
    /*Formulario*/
    this.loadProfileForm();
    this.loadNameProfileForm()
  }

  /**
   * Load the form Profile Password.
   */
  loadProfileForm():void{
    this.profileForm = this.fb.group({
      email:[{value:this.data.email, disabled:false},],
      current_password:[{value:'', disabled:false}, [Validators.required, Validators.minLength(8)]],
      new_password:[{value:'', disabled:false}, [Validators.required, Validators.minLength(8)]],
    });
  }

  /**
   * Load the form Profile Name.
   */
  loadNameProfileForm():void{
    this.nameProfileForm = this.fb.group({
      name:[{value:this.data.name, disabled:false}, Validators.required],
    });
  }

  changePassword(){
    this.submit = true;
    if(this.profileForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }

    this.authService.changePasswordUser(this.profileForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`${response.message}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  changeName(){
    this.submit = true;
    if(this.nameProfileForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this.authService.changeNameUser(this.nameProfileForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`${response.message}` );
      this.dialogRef.close(ModalResponse.UPDATE);

    })
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.profileForm.get(field)?.invalid &&
      this.profileForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.CLOSE);
  }

}
