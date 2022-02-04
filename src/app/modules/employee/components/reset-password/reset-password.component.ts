import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProfileUser} from "../../../auth/interfaces/login.interface";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {SharedService} from "../../../../shared/services/shared.service";
import {EmployeeService} from "../../services/employee.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styles: [
  ]
})
export class ResetPasswordComponent implements OnInit {

  /*Titulo Modal*/
  title: string = 'Usuario';
  hide = true;
  submit!: boolean;
  resetForm!: FormGroup;

  constructor(private employeeService: EmployeeService,
              private dialogRef: MatDialogRef<ResetPasswordComponent>,
              private fb: FormBuilder,
              private sharedService: SharedService,
              @Inject(MAT_DIALOG_DATA) public data : ProfileUser) { }

  ngOnInit(): void {
    this.loadResetForm()
  }

  /**
   * Load the form Profile Password.
   */
  loadResetForm():void{
    this.resetForm = this.fb.group({
      employee_id:[{value: this.data.id , disabled:false},],
      new_password:[{value: '' , disabled:false}, [Validators.required, Validators.minLength(8)]],
    });
  }

  changePassword(){
    this.submit = true;
    if(this.resetForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }

    this.employeeService.resetPassword(this.resetForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`La contraseña se cambió correctamente a: ${response.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.resetForm.get(field)?.invalid &&
      this.resetForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.CLOSE);
  }

}
