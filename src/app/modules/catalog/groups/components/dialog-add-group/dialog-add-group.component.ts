import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GroupService} from "../../services/groups.service";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dialog-add-group',
  templateUrl: './dialog-add-group.component.html',
  styleUrls: ['./dialog-add-group.component.css']
})
export class DialogAddGroupComponent implements OnInit {

  /*Formulario*/
  groupForm!: FormGroup;

  /*Titulo Modal*/
  title: string = 'Nuevo Grupo de Trabajo';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogAddGroupComponent>,
    private _groupService: GroupService,
    @Inject(MAT_DIALOG_DATA) public group : {idGroup: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadGroupForm();

    if(this.group.idGroup && this.group.edit){
      this.title = 'Editar Grupo de Trabajo';
      this.groupForm.updateValueAndValidity();
    }

    if(this.group.idGroup && !this.group.edit){
      this.title = 'Información del Grupo de Trabajo';
      this.groupForm.updateValueAndValidity();
    }

    if(this.group.idGroup){
      this.loadGroupById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadGroupById(): void{
    this._groupService.getGroupById(this.group.idGroup).subscribe(response => {
      delete response.id;
      delete response.created_at;
      delete response.updated_at;
      this.groupForm.setValue(response);
    })
  }

  /**
   * Load the form group.
   */
  loadGroupForm():void{
    this.groupForm = this.fb.group({
      name:[{value:null, disabled:this.group.info}, Validators.required],
      reason_social:[{value:null, disabled:this.group.info}],
      rfc:[{value:null, disabled:this.group.info}],
      phone:[{value:null, disabled:this.group.info}],
      email:[{value:null, disabled:this.group.info}],
      address: [{value:null, disabled:this.group.info}],
      city: [{value:null, disabled:this.group.info}],
      postal_code: [{value:null, disabled:this.group.info}]
    });
  }

  /**
   * Create a group.
   */
  addGroup(): void {
    this.submit = true;
    if(this.groupForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._groupService.postGroup(this.groupForm.value).subscribe(response => {
      console.log(response);
      this.showSnackBar('Se ha agregado correctamente el grupo.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a group.
   */
  updateGroup(): void {
    this.submit = true;
    if(this.groupForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._groupService.updateGroup(this.group.idGroup, this.groupForm.value).subscribe(response => {
      console.log(response);
      this.showSnackBar('Se ha actualizado correctamente el grupo.');
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
