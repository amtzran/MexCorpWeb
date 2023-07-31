import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {LiftingService} from "../../services/lifting.service";
import {TaskService} from "../../../task/services/task.service";
import {Customer} from "../../../customer/customers/interfaces/customer.interface";
import {Employee, JobCenter} from "../../../employee/interfaces/employee.interface";
import {DateService} from "../../../../core/utils/date.service";
import {AuthServiceService} from "../../../auth/services/auth-service.service";
import {ProfileUser} from "../../../auth/interfaces/login.interface";

@Component({
  selector: 'app-crud-quote',
  templateUrl: './crud-quote.component.html',
  styleUrls: ['./crud-quote.component.css']
})
export class CrudQuoteComponent implements OnInit {
  /*Formulario*/
  quoteForm!: FormGroup;
  /*Titulo Modal*/
  title: string = 'Nueva Cotización';
  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;
  // Select Products
  customers!: Customer[];
  employees!: Employee[];
  jobCenters!: JobCenter[];
  object: any;
  dataUser: ProfileUser = {
    name: ''
  };

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudQuoteComponent>,
    private liftingService: LiftingService,
    private taskService: TaskService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private dateService: DateService,
    private authService: AuthServiceService,
    @Inject(MAT_DIALOG_DATA) public quote : {idQuote: number, edit: boolean, info: boolean, idCustomer: number}
  ) { }

  ngOnInit(): void {
    /*Formulario*/
    this.loadToolForm();
    this.loadUser();
    this.taskService.getCustomers().subscribe(customers => {this.customers = customers.data} );
    this.taskService.getEmployees().subscribe(employees => {this.employees = employees.data} );
    this.taskService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )

   /* if(this.tool.data !== 0) this.loadToolById();

    this.employeeService.getProducts().subscribe(products => {this.products = products.data})

    if(this.tool.data !== null && this.tool.edit){
      this.title = 'Editar Cantidad';
      this.toolForm.updateValueAndValidity();
    }
*/
  }

  /**
   * Data User Session
   */
  loadUser(): void {
    this.authService.getUserById().subscribe(user => {
      this.dataUser = user;
      console.log(user)
    })
  }

  /**
   * Load the form tool.
   */
  loadToolForm():void{

    this.quoteForm = this.fb.group({
      id: [{value: '', disabled:this.quote.info}, ],
      customer_id:[{value: '', disabled:this.quote.info}, Validators.required],
      employee_id:[{value: '', disabled:this.quote.info}, ],
      job_center_id:[{value: '', disabled:this.quote.info}, Validators.required],
      seller_id:[{value: '', disabled:this.quote.info}, Validators.required],
      delivery_time: [{value: '', disabled:this.quote.info}, ],
      payment_conditions: [{value: '', disabled:this.quote.info}, ],
      observations: [{value: '', disabled:this.quote.info}, ],
    });

  }

  /**
   * Create Quote.
   */
  save(): void {

    this.validateForm();
    this.spinner.show()
    this.liftingService.saveQuote(this.object).subscribe(response => {
        this.spinner.hide()
        this.sharedService.showSnackBar('Se ha agregado correctamente la Cotización.');
        this.dialogRef.close(ModalResponse.UPDATE);
        this.spinner.hide()
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
    if(this.quoteForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }

    this.object = this.quoteForm.value;
    this.object.employee_id = this.dataUser.id;

    if (this.quoteForm.value.delivery_time !== ''){
      let delivery_time = this.dateService.getFormatDataDate(this.quoteForm.value.delivery_time);
      this.object.delivery_time = delivery_time;
    }

  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.quoteForm.get(field)?.invalid &&
      this.quoteForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.CLOSE);
  }


}
