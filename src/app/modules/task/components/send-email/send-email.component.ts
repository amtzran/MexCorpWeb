import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DoorByTask, EmailModel, EmailSend} from "../../models/task.interface";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TaskService} from "../../services/task.service";
import {Customer} from "../../../customer/customers/interfaces/customer.interface";
import {CustomerServiceService} from "../../../customer/customers/services/customer-service.service";
import {MatTableDataSource} from "@angular/material/table";
import {Contract} from "../../../catalog/contracts/models/contract.interface";

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
  customer!: Customer;
  displayedColumns: string[] = ['email','settings'];
  dataSourceTable: EmailSend[] = [];
  dataSource!: MatTableDataSource<EmailSend>;
  totalItems!: number;

  constructor(private dialogRef: MatDialogRef<SendEmailComponent>,
              private formBuilder: FormBuilder,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private taskService: TaskService,
              private customerService: CustomerServiceService,
              @Inject(MAT_DIALOG_DATA) public data : { doorTask: DoorByTask, taskId: number, customerId: number }) { }

  ngOnInit(): void {
    this.loadCustomer()
    this.loadEmailForm()
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.dataSourceTable;
  }

  /**
   * Load the form Task.
   */
  loadCustomer():void{
    this.spinner.show()
    this.customerService.getCustomerById(this.data.customerId).subscribe(res => {
      this.spinner.hide()
      this.emailForm.patchValue({email: res.data.email,})
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Load the form Task.
   */
  loadEmailForm():void{
    if (this.data.doorTask) {
      this.emailForm = this.formBuilder.group({
        task_id:[{value: this.data.taskId , disabled:false},],
        door_id:[{value: this.data.doorTask.id , disabled:false},],
        email:[{value: '' , disabled:false}, [Validators.required, Validators.email]],
        message:[{value: '' , disabled:false}, []],
      });
    } else {
      this.emailForm = this.formBuilder.group({
        task_id:[{value: this.data.taskId , disabled:false},],
        email:[{value: '' , disabled:false}, [Validators.required, Validators.email]],
        message:[{value: '' , disabled:false}, []],
      });
    }
  }

  add(){
    if(this.emailForm.get('email')?.valid){
      let objectForm = this.emailForm.value;
      this.dataSource.data.push(objectForm);
      this.emailForm.get('email')?.setValue('');
    }
    this.dataSource.data = this.dataSourceTable;
  }

  delete(email:EmailModel){
    this.dataSourceTable.forEach(element => {
      if(element.email === email.email){
        const index = this.dataSourceTable.indexOf(element, 0)
        this.dataSourceTable.splice(index, 1);
      }
    });
    this.dataSource.data = this.dataSourceTable;
  }

  /**
   * Send Email By Door in Task.
   */
  sendEmail(){
    if (this.dataSource.data.length < 1) return;
    this.spinner.show();
    this.dataSourceTable.forEach(element => {

       let objectEmail : EmailSend = {
         task_id: element.task_id,
         door_id: element.door_id,
         email: element.email,
         message: element.message,
       }
       this.taskService.sendEmail(objectEmail).subscribe(response => {
           this.spinner.hide()
           this.sharedService.showSnackBar(`${response.message}` );
         }, (error => {
           this.spinner.hide()
           this.sharedService.errorDialog(error)
         })
       );
    });
    this.dialogRef.close(ModalResponse.UPDATE);

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
