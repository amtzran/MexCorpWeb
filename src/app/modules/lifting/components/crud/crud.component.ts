import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
  dateNow: string | undefined = '';
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
      place:[{value: '', disabled:this.lifting.info}, Validators.required],
      series:[{value: '', disabled:this.lifting.info}],
      color: [{value: '', disabled:this.lifting.info},],
      lock_type: [{value: '', disabled:this.lifting.info},],
      type_of_handle: [{value: '', disabled:this.lifting.info},],
      folding: [{value: false, disabled:this.lifting.info},],
      sliding: [{value: false, disabled:this.lifting.info},],
      air_system: [{value: false, disabled:this.lifting.info},],
      smooth_stave: [{value: false, disabled:this.lifting.info},],
      louver: [{value: false, disabled:this.lifting.info},],
      others: [{value: '', disabled:this.lifting.info},],
      acrylic: [{value: false, disabled:this.lifting.info},],
      annealing: [{value: false, disabled:this.lifting.info},],
      tempered: [{value: false, disabled:this.lifting.info},],
      laminate: [{value: '', disabled:this.lifting.info},],
      duovent: [{value: '', disabled:this.lifting.info},],
      glass_color: [{value: '', disabled:this.lifting.info},],
      thickness: [{value: '', disabled:this.lifting.info},],
      polished_edge: [{value: false, disabled:this.lifting.info},],
      bowling_song: [{value: false, disabled:this.lifting.info},],
      dead_edge: [{value: false, disabled:this.lifting.info},],
      hole_diameter: [{value: '', disabled:this.lifting.info},],
      hangovers: [{value: false, disabled:this.lifting.info},],
      hinge_type: [{value: '', disabled:this.lifting.info},],
      hardware_type: [{value: '', disabled:this.lifting.info},],
      top_hardware: [{value: false, disabled:this.lifting.info},],
      bottom_hardware: [{value: false, disabled:this.lifting.info},],
      bracket_hardware: [{value: false, disabled:this.lifting.info},],
      rib_holder: [{value: false, disabled:this.lifting.info},],
      turning_point: [{value: false, disabled:this.lifting.info},],
      type_of_handle_measure: [{value: '', disabled:this.lifting.info},],
      others_two: [{value: '', disabled:this.lifting.info},],
      type_of_zoclo: [{value: '', disabled:this.lifting.info},],
      type_of_fittings: [{value: '', disabled:this.lifting.info},],
      perimeter_frame: [{value: '', disabled:this.lifting.info},],
      back_frame: [{value: '', disabled:this.lifting.info},],
      attached_to_the_wall: [{value: false, disabled:this.lifting.info},],
      glued_to_frame: [{value: false, disabled:this.lifting.info},],
      wide: [{value: '', disabled:this.lifting.info},],
      high: [{value: '', disabled:this.lifting.info},],
      quotation: [{value: false, disabled:this.lifting.info},],
      manufacturing: [{value: false, disabled:this.lifting.info},],
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
        console.log(response.data)
        this.imageFile = response.data.photo_one
        this.folio = response.data.folio;
        this.dateNow = response.data.date;
        delete response.data.id;
        delete response.data.folio;
        delete response.data.job_center_name;
        delete response.data.customer_name;
        delete response.data.employee_name;
        delete response.data.work_type_name;
        delete response.data.report_pdf;
        this.liftingForm.setValue(response.data);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
  }

  /**
   * Create lifting.
   */
  addLifting(): void {
    this.validateCheck()
    this.createFormData(this.liftingForm.value);
    this.spinner.show()
    this.liftingService.addLifting(this.fileDataForm).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar('Se ha agregado correctamente el levantamiento.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a lifting.
   */
  updateLifting(): void {
    this.createFormData(this.liftingForm.value);
    //this.spinner.show()
    this.liftingService.updateLifting(this.lifting.idLifting, this.fileDataForm).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el acceso: ${response.data.folio}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  validateCheck() : void {
    if (!this.liftingForm.value.folding) this.liftingForm.get('folding')?.setValue(0);
    if (!this.liftingForm.value.sliding) this.liftingForm.get('sliding')?.setValue(0);
    if (!this.liftingForm.value.air_system) this.liftingForm.get('air_system')?.setValue(0);
    if (!this.liftingForm.value.smooth_stave) this.liftingForm.get('smooth_stave')?.setValue(0);
    if (!this.liftingForm.value.louver) this.liftingForm.get('louver')?.setValue(0);

    if (!this.liftingForm.value.acrylic) this.liftingForm.get('acrylic')?.setValue(0);
    if (!this.liftingForm.value.annealing) this.liftingForm.get('annealing')?.setValue(0);
    if (!this.liftingForm.value.tempered) this.liftingForm.get('tempered')?.setValue(0);
    if (!this.liftingForm.value.polished_edge) this.liftingForm.get('polished_edge')?.setValue(0);
    if (!this.liftingForm.value.bowling_song) this.liftingForm.get('bowling_song')?.setValue(0);
    if (!this.liftingForm.value.dead_edge) this.liftingForm.get('dead_edge')?.setValue(0);

    if (!this.liftingForm.value.hangovers) this.liftingForm.get('hangovers')?.setValue(0);
    if (!this.liftingForm.value.top_hardware) this.liftingForm.get('top_hardware')?.setValue(0);
    if (!this.liftingForm.value.bottom_hardware) this.liftingForm.get('bottom_hardware')?.setValue(0);
    if (!this.liftingForm.value.bracket_hardware) this.liftingForm.get('bracket_hardware')?.setValue(0);
    if (!this.liftingForm.value.rib_holder) this.liftingForm.get('rib_holder')?.setValue(0);
    if (!this.liftingForm.value.turning_point) this.liftingForm.get('turning_point')?.setValue(0);

    if (!this.liftingForm.value.attached_to_the_wall) this.liftingForm.get('attached_to_the_wall')?.setValue(0);
    if (!this.liftingForm.value.glued_to_frame) this.liftingForm.get('glued_to_frame')?.setValue(0);
    if (!this.liftingForm.value.quotation) this.liftingForm.get('quotation')?.setValue(0);
    if (!this.liftingForm.value.manufacturing) this.liftingForm.get('manufacturing')?.setValue(0);
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.liftingForm.get(field)?.invalid &&
      this.liftingForm.get(field)?.touched
  }

  // Events Checked
  changeFolding(event: any) {
    this.liftingForm.get('folding')?.setValue(0);
    if (event.checked) this.liftingForm.get('folding')?.setValue(1);
  }

  changeSliding(event: any) {
    this.liftingForm.get('sliding')?.setValue(0);
    if (event.checked) this.liftingForm.get('sliding')?.setValue(1);
  }

  changeAirSystem(event: any) {
    this.liftingForm.get('air_system')?.setValue(0);
    if (event.checked) this.liftingForm.get('air_system')?.setValue(1);
  }

  changeSmoothStave(event: any) {
    this.liftingForm.get('smooth_stave')?.setValue(0);
    if (event.checked) this.liftingForm.get('smooth_stave')?.setValue(1);
  }

  changeLouver(event: any) {
    this.liftingForm.get('louver')?.setValue(0);
    if (event.checked) this.liftingForm.get('louver')?.setValue(1);
  }

  changeAcrylic(event: any) {
    this.liftingForm.get('acrylic')?.setValue(0);
    if (event.checked) this.liftingForm.get('acrylic')?.setValue(1);
  }

  changeAnnealing(event: any) {
    this.liftingForm.get('annealing')?.setValue(0);
    if (this.liftingForm.value.annealing === true) this.liftingForm.get('annealing')?.setValue(1);
  }

  changeTempered(event: any) {
    this.liftingForm.get('tempered')?.setValue(0);
    if (event.checked) this.liftingForm.get('tempered')?.setValue(1);
  }

  changePolishedEdge(event: any) {
    this.liftingForm.get('polished_edge')?.setValue(0);
    if (event.checked) this.liftingForm.get('polished_edge')?.setValue(1);
  }

  changeBowlingSong(event: any) {
    this.liftingForm.get('bowling_song')?.setValue(0);
    if (event.checked) this.liftingForm.get('bowling_song')?.setValue(1);
  }

  changeDeadEdge(event: any) {
    this.liftingForm.get('dead_edge')?.setValue(0);
    if (event.checked) this.liftingForm.get('dead_edge')?.setValue(1);
  }

  changeHangovers(event: any) {
    this.liftingForm.get('hangovers')?.setValue(0);
    if (event.checked) this.liftingForm.get('hangovers')?.setValue(1);
  }

  changeTopHardware(event: any) {
    this.liftingForm.get('top_hardware')?.setValue(0);
    if (event.checked) this.liftingForm.get('top_hardware')?.setValue(1);
  }

  changeBottomHardware(event: any) {
    this.liftingForm.get('bottom_hardware')?.setValue(0);
    if (event.checked) this.liftingForm.get('bottom_hardware')?.setValue(1);
  }

  changeBracketHardware(event: any) {
    this.liftingForm.get('bracket_hardware')?.setValue(0);
    if (event.checked) this.liftingForm.get('bracket_hardware')?.setValue(1);
  }

  changeRipHolder(event: any) {
    this.liftingForm.get('rib_holder')?.setValue(0);
    if (event.checked) this.liftingForm.get('rib_holder')?.setValue(1);
  }

  changeTurningPoint(event: any) {
    this.liftingForm.get('turning_point')?.setValue(0);
    if (event.checked) this.liftingForm.get('turning_point')?.setValue(1);
  }

  changeAttached(event: any) {
    this.liftingForm.get('attached_to_the_wall')?.setValue(0);
    if (event.checked) this.liftingForm.get('attached_to_the_wall')?.setValue(1);
  }

  changeGlued(event: any) {
    this.liftingForm.get('glued_to_frame')?.setValue(0);
    if (event.checked) this.liftingForm.get('glued_to_frame')?.setValue(1);
  }

  changeQuotation(event: any) {
    this.liftingForm.get('quotation')?.setValue(0);
    if (event.checked) this.liftingForm.get('quotation')?.setValue(1);
  }

  changeManufacturing(event: any) {
    this.liftingForm.get('manufacturing')?.setValue(0);
    if(event.checked) this.liftingForm.get('manufacturing')?.setValue(1);
  }
  //End events

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

        else if (key === 'photo_two') {
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
  setFilePhotoOne(e : any){
    this.liftingForm.get('photo_one')?.setValue(e.target.files[0])
  }

  setFilePhotoTwo(e : any){
    this.liftingForm.get('photo_two')?.setValue(e.target.files[0])
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
