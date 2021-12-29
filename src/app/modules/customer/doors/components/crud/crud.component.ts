import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {DoorService} from "../../services/door.service";
import {DoorType} from "../../interfaces/door.interface";
import {SharedService} from "../../../../../shared/services/shared.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  doorForm!: FormGroup;

  /*Titulo Modal*/
  title: string = 'Nuevo Acceso';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  // Fill Selects Contracts and Type customer
  doorTypes: DoorType[] = [];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _dooService: DoorService,
    @Inject(MAT_DIALOG_DATA) public door : {idDoor: number, edit: boolean, info: boolean, idCustomer: number}
  ) { }

  ngOnInit(): void {

    // Door Types init
    this._dooService.getDoorTypes()
      .subscribe(doorTypes => {
        this.doorTypes = doorTypes.data
      } )

    /*Formulario*/
    this.loadDoorForm();

    if(this.door.idDoor && this.door.edit){
      this.title = 'Editar Acceso';
      this.doorForm.updateValueAndValidity();
    }

    if(this.door.idDoor && !this.door.edit){
      this.title = 'Información del Acceso';
      this.doorForm.updateValueAndValidity();
    }

    if(this.door.idDoor){
      this.loadGroupById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadGroupById(): void{
    this._dooService.getDoorById(this.door.idDoor).subscribe(response => {
      delete response.data.id;
      delete response.data.folio;
      delete response.data.created_at;
      delete response.data.updated_at;
      delete response.data.customer_name;
      delete response.data.door_type_name;
      delete response.data.is_active;
      delete response.data.photo;
      this.doorForm.setValue(response.data);
    })
  }

  /**
   * Load the form group.
   */
  loadDoorForm():void{
    this.doorForm = this.fb.group({
      name:[{value:null, disabled:this.door.info}, Validators.required],
      observations:[{value: '', disabled:this.door.info}],
      door_type_id: [{value: '', disabled:this.door.info}, Validators.required],
      customer_id: [{value: this.door.idCustomer, disabled:this.door.info}]
    });
  }

  /**
   * Create access.
   */
  addDoor(): void {
    this.submit = true;
    if(this.doorForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this.doorForm.addControl('customer', new FormControl(this.door.idCustomer))
    this._dooService.addDoor(this.doorForm.value).subscribe(response => {
      this.sharedService.showSnackBar('Se ha agregado correctamente el acceso.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a access.
   */
  updateDoor(): void {
    this.submit = true;
    if(this.doorForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._dooService.updateDoor(this.door.idDoor, this.doorForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el acceso: ${response.data.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.doorForm.get(field)?.invalid &&
      this.doorForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
