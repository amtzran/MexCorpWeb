import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../../../customer/customers/interfaces/customer.interface";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TaskService} from "../../../task/services/task.service";
import {CustomerServiceService} from "../../../customer/customers/services/customer-service.service";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {Quotation} from "../../interfaces/lifting.interface";
import {LiftingService} from "../../services/lifting.service";

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styles: [
  ]
})
export class SendEmailComponent implements OnInit {

  /*Titulo Modal*/
  title: string = 'Enviar Reporte';
  hide = true;
  submit!: boolean;
  emailForm!: FormGroup;
  customer!: Customer;

  constructor(private dialogRef: MatDialogRef<SendEmailComponent>,
              private formBuilder: FormBuilder,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private taskService: TaskService,
              private liftingService: LiftingService,
              @Inject(MAT_DIALOG_DATA) public quotation : {row: Quotation}) { }

  ngOnInit(): void {
    this.loadEmailForm()
  }

  /**
   * Load the form Task.
   */
  loadEmailForm():void{
    this.emailForm = this.formBuilder.group({
      quote_id:[{value: this.quotation.row.id , disabled:false},],
      email:[{value: '' , disabled:false}, [Validators.required, Validators.email]],
    });
  }

  /**
   * Send Email By Door in Task.
   */
  sendEmail(){
    this.spinner.show()
    this.liftingService.sendEmail(this.emailForm.value).subscribe(response => {
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
