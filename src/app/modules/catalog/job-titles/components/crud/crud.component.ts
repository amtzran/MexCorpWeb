import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {JobTitleService} from "../../services/job-title.service";
import {SharedService} from "../../../../../shared/services/shared.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  jobTitleForm!: FormGroup;

  /*Titulo Modal*/
  title: string = 'Nuevo Puesto';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _jobTitleService: JobTitleService,
    @Inject(MAT_DIALOG_DATA) public jobTitle : {idJobTitle: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadJobTitleForm();

    if(this.jobTitle.idJobTitle && this.jobTitle.edit){
      this.title = 'Editar Puesto';
      this.jobTitleForm.updateValueAndValidity();
    }

    if(this.jobTitle.idJobTitle && !this.jobTitle.edit){
      this.title = 'Información del Puesto';
      this.jobTitleForm.updateValueAndValidity();
    }

    if(this.jobTitle.idJobTitle){
      this.loadJobTitleById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadJobTitleById(): void{
    this._jobTitleService.getJobTitleById(this.jobTitle.idJobTitle).subscribe(response => {
      delete response.id;
      delete response.created_at;
      delete response.updated_at;
      this.jobTitleForm.setValue(response);
    })
  }

  /**
   * Load the form group.
   */
  loadJobTitleForm():void{
    this.jobTitleForm = this.fb.group({
      name:[{value:null, disabled:this.jobTitle.info}, Validators.required],
      description:[{value:null, disabled:this.jobTitle.info}],
    });
  }

  /**
   * Create Job Title.
   */
  addJobTitle(): void {
    this.submit = true;
    if(this.jobTitleForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._jobTitleService.addJobTitle(this.jobTitleForm.value).subscribe(response => {
      this.sharedService.showSnackBar('Se ha agregado correctamente el Puesto.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a Job Title.
   */
  updateJobTitle(): void {
    this.submit = true;
    if(this.jobTitleForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._jobTitleService.updateJobTitle(this.jobTitle.idJobTitle, this.jobTitleForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el Puesto: ${response.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.jobTitleForm.get(field)?.invalid &&
      this.jobTitleForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
