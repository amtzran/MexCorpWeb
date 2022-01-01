import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {MatDialogRef} from "@angular/material/dialog";

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

  constructor(private dialogRef: MatDialogRef<CrudComponent>,
              private fb: FormBuilder,) { }

  ngOnInit(): void {
    /*Formulario*/
    this.loadProfileForm();
  }

  /**
   * Load the form group.
   */
  loadProfileForm():void{
    this.profileForm = this.fb.group({
      name:[{value:null, disabled:false}, Validators.required],
      description:[{value:'', disabled:false}],
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

  updateProfile(){
    console.log('update')
  }

}
