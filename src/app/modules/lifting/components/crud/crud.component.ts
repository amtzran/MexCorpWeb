import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {SharedService} from "../../../../shared/services/shared.service";
import {LiftingService} from "../../services/lifting.service";
import {Customer} from "../../../customer/customers/interfaces/customer.interface";
import {Employee, JobCenter} from "../../../employee/interfaces/employee.interface";
import {WorkType} from "../../../catalog/work-types/models/work-type.interface";
import {TaskService} from "../../../task/services/task.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  title = 'Levantamiento';
  folio: string | undefined = '' ;
  imageFile: string | null | undefined = '';
  liftingForm!: FormGroup;
  fileDataForm = new FormData();
  customers: Customer[] = [];
  jobCenters: JobCenter[] = [];
  employees: Employee[] = [];
  workTypes: WorkType[] = [];

  constructor(private dialogRef: MatDialogRef<CrudComponent>,
              private liftingService: LiftingService,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private formBuilder: FormBuilder,
              private taskService: TaskService,
              @Inject(MAT_DIALOG_DATA) public lifting : {idLifting: number, edit: boolean, info: boolean, idCustomer: number})
  { }

  ngOnInit(): void {
    this.imageFile = null

    this.loadDataCustomers();
    this.loadDataGroups();
    this.loadDataEmployees();
    this.loadDataWorkTypes()
    this.loadLiftingForm();

    if(this.lifting.idLifting){
      this.loadGroupById();
    }
  }

  /**
   * Load the form lifting.
   */
  loadLiftingForm():void{
    this.liftingForm = this.formBuilder.group({
      job_center_id:[{value: '', disabled:this.lifting.info}, Validators.required],
      customer_id:[{value: '', disabled:this.lifting.info}, Validators.required],
      employee_id:[{value: '', disabled:this.lifting.info}, Validators.required],
      work_type_id:[{value: '', disabled:this.lifting.info}, Validators.required],
      date:[{value: '', disabled:this.lifting.info}],
      place:[{value: '', disabled:this.lifting.info}],
      series:[{value: '', disabled:this.lifting.info}],
      color: [{value: '', disabled:this.lifting.info},],
      lock_type: [{value: '', disabled:this.lifting.info},],
      type_of_handle: [{value: '', disabled:this.lifting.info},],
      folding: [{value: '', disabled:this.lifting.info},],
      sliding: [{value: '', disabled:this.lifting.info},],
      air_system: [{value: '', disabled:this.lifting.info},],
      smooth_stave: [{value: '', disabled:this.lifting.info},],
      louver: [{value: '', disabled:this.lifting.info},],
      others: [{value: '', disabled:this.lifting.info},],
      acrylic: [{value: '', disabled:this.lifting.info},],
      annealing: [{value: '', disabled:this.lifting.info},],
      tempered: [{value: '', disabled:this.lifting.info},],
      laminate: [{value: '', disabled:this.lifting.info},],
      duovent: [{value: '', disabled:this.lifting.info},],
      glass_color: [{value: '', disabled:this.lifting.info},],
      thickness: [{value: '', disabled:this.lifting.info},],
      polished_edge: [{value: '', disabled:this.lifting.info},],
      bowling_song: [{value: '', disabled:this.lifting.info},],
      dead_edge: [{value: '', disabled:this.lifting.info},],
      hole_diameter: [{value: '', disabled:this.lifting.info},],
      hangovers: [{value: '', disabled:this.lifting.info},],
      hinge_type: [{value: '', disabled:this.lifting.info},],
      hardware_type: [{value: '', disabled:this.lifting.info},],
      top_hardware: [{value: '', disabled:this.lifting.info},],
      bottom_hardware: [{value: '', disabled:this.lifting.info},],
      bracket_hardware: [{value: '', disabled:this.lifting.info},],
      rib_holder: [{value: '', disabled:this.lifting.info},],
      turning_point: [{value: '', disabled:this.lifting.info},],
      type_of_handle_measure: [{value: '', disabled:this.lifting.info},],
      others_two: [{value: '', disabled:this.lifting.info},],
      type_of_zoclo: [{value: '', disabled:this.lifting.info},],
      type_of_fittings: [{value: '', disabled:this.lifting.info},],
      perimeter_frame: [{value: '', disabled:this.lifting.info},],
      back_frame: [{value: '', disabled:this.lifting.info},],
      attached_to_the_wall: [{value: '', disabled:this.lifting.info},],
      glued_to_frame: [{value: '', disabled:this.lifting.info},],
      wide: [{value: '', disabled:this.lifting.info},],
      high: [{value: '', disabled:this.lifting.info},],
      quotation: [{value: '', disabled:this.lifting.info},],
      manufacturing: [{value: '', disabled:this.lifting.info},],
      working_hours: [{value: '', disabled:this.lifting.info},],
      work_at_height: [{value: '', disabled:this.lifting.info},],
      work_description: [{value: '', disabled:this.lifting.info},],
      photo_one: [{value: '', disabled:this.lifting.info}],
      photo_two: [{value: '', disabled:this.lifting.info}],
      photo_three: [{value: '', disabled:this.lifting.info}],
      status: [{value: '', disabled:this.lifting.info}],
    });
  }

  /**
   * Get detail retrieve of one lifting.
   */
  loadGroupById(): void{
    this.spinner.show()
    this.liftingService.getLiftingById(this.lifting.idLifting).subscribe(response => {
        this.spinner.hide()
        delete response.data.id;
        this.folio = response.data.folio;
        delete response.data.folio;
        this.liftingForm.setValue(response.data);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
  }

  /**
   * Update a access.
   */
  updateLifting(): void {
    this.createFormData(this.liftingForm.value);
    this.spinner.show()
    this.liftingService.updateLifting(this.lifting.idLifting, this.fileDataForm).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el acceso: ${response.data.folio}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.liftingForm.get(field)?.invalid &&
      this.liftingForm.get(field)?.touched
  }

  /**
   * Method convert formGroup a DataForm and wor with files
   * @param formValue
   */
  createFormData(formValue:any){

    for(const key of Object.keys(formValue)){
      const value = formValue[key];
      if (value !== null) {
        if (key === 'photo_one') {
          if (typeof(value) !== 'object') {
            if (value.startsWith('https')) this.fileDataForm.append(key, '');
          }
          else this.fileDataForm.append(key, value);
        }
        else {
          this.fileDataForm.append(key, value);
        }
      }

    }

  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

  /* File onchange event */
  setFileLogo(e : any){
    this.liftingForm.get('photo_one')?.setValue(e.target.files[0])
  }

  /**
   * Array from service for Customers
   */
  loadDataCustomers(){
    this.taskService.getCustomers().subscribe(customers => {this.customers = customers.data} )
  }

  /**
   * Array from service for Groups
   */
  loadDataGroups(){
    this.taskService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
  }

  /**
   * Array from service for Employees
   */
  loadDataEmployees(){
    this.taskService.getEmployees().subscribe(employees => {this.employees = employees.data} )
  }

  /**
   * Array from service for Employees
   */
  loadDataWorkTypes(){
    this.taskService.getWorkTypes().subscribe(workTypes => {this.workTypes = workTypes.data} )
  }

}
