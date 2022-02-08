import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DoorByTask} from "../../models/task.interface";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styles: []
})
export class SendEmailComponent implements OnInit {

  /*Titulo Modal*/
  title: string = 'Enviar Reporte';
  hide = true;
  submit!: boolean;
  emailForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<SendEmailComponent>,
              private formBuilder: FormBuilder,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private taskService: TaskService,
              @Inject(MAT_DIALOG_DATA) public data : { doorTask: DoorByTask, taskId: number }) { }

  ngOnInit(): void {
    this.loadEmailForm()
  }

  /**
   * Load the form Task.
   */
  loadEmailForm():void{
    this.emailForm = this.formBuilder.group({
      task_id:[{value: this.data.taskId , disabled:false},],
      door_id:[{value: this.data.doorTask.id , disabled:false},],
      email:[{value: '' , disabled:false}, [Validators.required, Validators.email]],
    });
  }

  /**
   * Send Email By Door in Task.
   */
  sendEmail(){
    this.validateForm()
    this.spinner.show()
    this.taskService.sendEmail(this.emailForm.value).subscribe(response => {
        this.spinner.hide()
        this.sharedService.showSnackBar(`${response.message}` );
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
    if(this.emailForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.emailForm.get(field)?.invalid &&
      this.emailForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.CLOSE);
  }
}
