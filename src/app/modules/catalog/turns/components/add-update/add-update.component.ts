import {Component, Inject, OnInit} from '@angular/core';
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedService} from "../../../../../shared/services/shared.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {TurnService} from "../../services/turn.service";

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styles: [
  ]
})
export class AddUpdateComponent implements OnInit {

  turnForm!: FormGroup;
  title: string = 'Nuevo Turno';
  showError!: boolean;
  submit!: boolean;

  constructor(private fb: FormBuilder,
              private sharedService: SharedService,
              private dialogRef: MatDialogRef<AddUpdateComponent>,
              private turnService: TurnService,
              private spinner: NgxSpinnerService,
              @Inject(MAT_DIALOG_DATA) public turn : {idTurn: number, edit: boolean, info: boolean}) { }

  ngOnInit(): void {
    this.loadTurnForm();

    if(this.turn.idTurn && this.turn.edit){
      this.title = 'Editar Turno';
      this.turnForm.updateValueAndValidity();
    }

    if(this.turn.idTurn) this.loadTurnById();

  }

  /**
   * Get detail retrieve of one product.
   */
  loadTurnById(): void{
    this.spinner.show()
    this.turnService.getTurnById(this.turn.idTurn).subscribe(response => {
        this.spinner.hide();
        delete response.data.id;
        delete response.data.created_at;
        delete response.data.updated_at;
        this.turnForm.patchValue({
          name: response.data.name,
          initial_hour: response.data.initial_hour,
          final_date: response.data.final_hour
        })
        this.turnForm.setValue(response.data);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
  }

  /**
   * Load the form product.
   */
  loadTurnForm():void{
    this.turnForm = this.fb.group({
      name:[{value:null, disabled:this.turn.info}, Validators.required],
      initial_hour:[{value: '', disabled:this.turn.info}, Validators.required],
      final_hour:[{value: '', disabled:this.turn.info}, Validators.required],
    });
  }

  /**
   * Create turn.
   */
  addTurn(): void {
    this.validateForm()
    this.spinner.show()
    this.turnService.addTurn(this.turnForm.value).subscribe(response => {
       this.spinner.hide()
       this.sharedService.showSnackBar('Se ha agregado correctamente el turno.');
       this.dialogRef.close(ModalResponse.UPDATE);
       }, (error => {
         this.spinner.hide()
         this.sharedService.errorDialog(error)
       })
     )
  }

  /**
   * Update a turn.
   */
  updateTurn(): void {
    this.validateForm()
    this.spinner.show()
    this.turnService.updateTurn(this.turn.idTurn, this.turnForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el turno: ${response.data.name}` );
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
    if(this.turnForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.turnForm.get(field)?.invalid &&
      this.turnForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
