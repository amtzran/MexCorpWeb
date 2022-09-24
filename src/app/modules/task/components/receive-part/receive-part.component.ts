import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TaskService} from "../../services/task.service";
import {ModalResponse} from "../../../../core/utils/ModalResponse";

@Component({
  selector: 'app-receive-part',
  templateUrl: './receive-part.component.html',
  styles: [
  ]
})
export class ReceivePartComponent implements OnInit {

  /*Titulo Modal*/
  title: string = 'Recibir Refacciones';
  receiveForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<ReceivePartComponent>,
              private formBuilder: FormBuilder,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private taskService: TaskService,
              @Inject(MAT_DIALOG_DATA) public data : any) { }

  ngOnInit(): void {
    this.loaForm();
  }

  /**
   * Load the form Task.
   */
  loaForm():void{
    this.receiveForm = this.formBuilder.group({
      refund:[{value: '', disabled:false}, [Validators.required]],
    });
  }

  /**
   * send Refund.
   */
  save(){
    if (this.receiveForm.invalid) return;
    this.taskService.addRefundByConceptByTask(this.data.id, this.receiveForm.value).subscribe(response => {
        this.spinner.hide()
        this.sharedService.showSnackBar(`${response.message}`);
        this.sharedService.updateComponent();
        this.dialogRef.close();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    );

  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.receiveForm.get(field)?.invalid &&
      this.receiveForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.CLOSE);
  }

}
