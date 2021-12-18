import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {DoorTypeService} from "../../services/door-type.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  doorTypeForm!: FormGroup;

  /*Titulo Modal*/
  title: string = 'Nuevo Tipo de Acceso';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _doorTypeService: DoorTypeService,
    @Inject(MAT_DIALOG_DATA) public doorType : {idDoorType: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadDoorTypeForm();

    if(this.doorType.idDoorType && this.doorType.edit){
      this.title = 'Editar Tipo de Cliente';
      this.doorTypeForm.updateValueAndValidity();
    }

    if(this.doorType.idDoorType && !this.doorType.edit){
      this.title = 'Información del Tipo de Cliente';
      this.doorTypeForm.updateValueAndValidity();
    }

    if(this.doorType.idDoorType){
      this.loadDoorById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadDoorById(): void{
    this._doorTypeService.getDoorTypeById(this.doorType.idDoorType).subscribe(response => {
      delete response.id;
      delete response.created_at;
      delete response.updated_at;
      this.doorTypeForm.setValue(response);
    })
  }

  /**
   * Load the form group.
   */
  loadDoorTypeForm():void{
    this.doorTypeForm = this.fb.group({
      name:[{value:null, disabled:this.doorType.info}, Validators.required],
      description:[{value:null, disabled:this.doorType.info}],
    });
  }

  /**
   * Create employee.
   */
  addDoorType(): void {
    this.submit = true;
    if(this.doorTypeForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._doorTypeService.addDoorType(this.doorTypeForm.value).subscribe(response => {
      this.showSnackBar('Se ha agregado correctamente el tipo deAcceso.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a employee.
   */
  updateDoorType(): void {
    this.submit = true;
    if(this.doorTypeForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._doorTypeService.updateDoorType(this.doorType.idDoorType, this.doorTypeForm.value).subscribe(response => {
      this.showSnackBar(`Se ha actualizado correctamente el tipo de Acceso: ${response.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.doorTypeForm.get(field)?.invalid &&
      this.doorTypeForm.get(field)?.touched
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
