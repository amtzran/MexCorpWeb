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
  }

  /**
   * Load the form group.
   */
  loadProfileForm():void{
    this.profileForm = this.fb.group({
      email:[{value:this.data.email, disabled:false},],
      current_password:[{value:'', disabled:false}, [Validators.required, Validators.minLength(8)]],
      new_password:[{value:'', disabled:false}, [Validators.required, Validators.minLength(8)]],
    });
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


  changePassword(){
    this.submit = true;
    if(this.profileForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    //this.profileForm.setValue({email: this.data.email})
    this.authService.chanePasswordUser(this.profileForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`${response.message}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

}
