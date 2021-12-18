import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {DoorService} from "../../services/door.service";
import {DoorType} from "../../interfaces/door.interface";
import {ActivatedRoute} from "@angular/router";

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
  title: string = 'Nueva Puerta';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  // Fill Selects Contracts and Type customer
  doorTypes: DoorType[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _dooService: DoorService,
    @Inject(MAT_DIALOG_DATA) public door : {idDoor: number, edit: boolean, info: boolean, idCustomer: number}
  ) { }

  ngOnInit(): void {

    // Door Types init
    this._dooService.getDoorTypes()
      .subscribe(doorTypes => {
        this.doorTypes = doorTypes.results
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
      delete response.id;
      delete response.folio;
      delete response.created_at;
      delete response.updated_at;
      this.doorForm.setValue(response);
    })
  }

  /**
   * Load the form group.
   */
  loadDoorForm():void{
    this.doorForm = this.fb.group({
      name:[{value:null, disabled:this.door.info}, Validators.required],
      observations:[{value:null, disabled:this.door.info}, Validators.required],
      door_type: [{value: '', disabled:this.door.info}, Validators.required],
      //customer: [{value: this.idCustomer, disabled:this.door.info},],
    });
  }

  /**
   * Create access.
   */
  addDoor(): void {
    this.submit = true;
    if(this.doorForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this.doorForm.addControl('customer', new FormControl(this.door.idCustomer))
    this._dooService.addDoor(this.doorForm.value).subscribe(response => {
      this.showSnackBar('Se ha agregado correctamente el acceso.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a access.
   */
  updateDoor(): void {
    this.submit = true;
    if(this.doorForm.invalid){
      this.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._dooService.updateDoor(this.door.idDoor, this.doorForm.value).subscribe(response => {
      this.showSnackBar(`Se ha actualizado correctamente el acceso: ${response.name}` );
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
