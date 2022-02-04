import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {DoorTypeService} from "../../services/door-type.service";
import {SharedService} from "../../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";

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
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
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
    this.spinner.show()
    this._doorTypeService.getDoorTypeById(this.doorType.idDoorType).subscribe(response => {
      this.spinner.hide()
      delete response.data.id;
      delete response.data.is_active;
      delete response.data.created_at;
      delete response.data.updated_at;
      this.doorTypeForm.setValue(response.data);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
  }

  /**
   * Load the form group.
   */
  loadDoorTypeForm():void{
    this.doorTypeForm = this.fb.group({
      name:[{value:null, disabled:this.doorType.info}, Validators.required],
      description:[{value:'', disabled:this.doorType.info}],
    });
  }

  /**
   * Create employee.
   */
  addDoorType(): void {
    this.validateForm()
    this.spinner.show()
    this._doorTypeService.addDoorType(this.doorTypeForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar('Se ha agregado correctamente el tipo deAcceso.');
      this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Update a employee.
   */
  updateDoorType(): void {
    this.validateForm()
    this.spinner.show()
    this._doorTypeService.updateDoorType(this.doorType.idDoorType, this.doorTypeForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el tipo de Acceso: ${response.data.name}` );
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
    if(this.doorTypeForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
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

}
