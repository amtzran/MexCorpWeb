import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../../../customer/customers/interfaces/customer.interface";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TaskService} from "../../../task/services/task.service";
import {CustomerServiceService} from "../../../customer/customers/services/customer-service.service";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {EmailSend, Quotation} from "../../interfaces/lifting.interface";
import {LiftingService} from "../../services/lifting.service";
import {EmailModel} from "../../../task/models/task.interface";
import {MatTableDataSource} from "@angular/material/table";

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
  displayedColumns: string[] = ['email','settings'];
  dataSourceTable: EmailSend[] = [];
  dataSource!: MatTableDataSource<EmailSend>;
  totalItems!: number;
  customerId: number = 0;

  constructor(private dialogRef: MatDialogRef<SendEmailComponent>,
              private formBuilder: FormBuilder,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private taskService: TaskService,
              private liftingService: LiftingService,
              private customerService: CustomerServiceService,
              @Inject(MAT_DIALOG_DATA) public quotation : {row: Quotation}) { }

  ngOnInit(): void {
    if (this.quotation.row.lifting === null) this.customerId = this.quotation.row.quote_without_lifting_id.customer_id
    else this.customerId = this.quotation.row.lifting.customer_id;
    this.loadEmailForm();
    this.loadCustomer();
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.dataSourceTable;
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
    this.spinner.show()
    this.dataSourceTable.forEach(element => {

      let objectEmail : EmailSend = {
        quote_id: element.quote_id,
        email: element.email
      }
      this.liftingService.sendEmail(objectEmail).subscribe(response => {
          this.spinner.hide()
          this.sharedService.showSnackBar(`${response.message}` );
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      )
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

  /**
   * Load the form Task.
   */
  loadCustomer():void{
    this.spinner.show()
    this.customerService.getCustomerById(this.customerId).subscribe(res => {
        this.spinner.hide()
        this.emailForm.patchValue({email: res.data.email,})
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

}
