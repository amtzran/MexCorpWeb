import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {WorkTypeService} from "../../services/work-type.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  workTypeForm!: FormGroup;

  /*Titulo Modal*/
  title: string = 'Nuevo Tipo de Trabajo';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _workTypeService: WorkTypeService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public workType : {idWorkType: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadWorkTypeForm();

    if(this.workType.idWorkType && this.workType.edit){
      this.title = 'Editar Tipo de Trabajo';
      this.workTypeForm.updateValueAndValidity();
    }

    if(this.workType.idWorkType && !this.workType.edit){
      this.title = 'Información del Tipo de Trabajo';
      this.workTypeForm.updateValueAndValidity();
    }

    if(this.workType.idWorkType){
      this.loadWorkById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadWorkById(): void{
    this._workTypeService.getWorkTypeById(this.workType.idWorkType).subscribe(response => {
      delete response.id;
      delete response.created_at;
      delete response.updated_at;
      this.workTypeForm.setValue(response);
    })
  }

  /**
   * Load the form group.
   */
  loadWorkTypeForm():void{
    this.workTypeForm = this.fb.group({
      name:[{value:null, disabled:this.workType.info}, Validators.required],
      description:[{value:'', disabled:this.workType.info}],
    });
  }

  /**
   * Create Wor Type.
   */
  addWorkType(): void {
    this.submit = true;
    if(this.workTypeForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._workTypeService.addWorkType(this.workTypeForm.value).subscribe(response => {
      this.sharedService.showSnackBar('Se ha agregado correctamente el tipo deAcceso.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a employee.
   */
  updateWorkType(): void {
    this.submit = true;
    if(this.workTypeForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._workTypeService.updateWorkType(this.workType.idWorkType, this.workTypeForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el tipo de Trabajo: ${response.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.workTypeForm.get(field)?.invalid &&
      this.workTypeForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
