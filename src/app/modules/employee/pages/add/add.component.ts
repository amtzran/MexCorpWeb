import { Component, OnInit } from '@angular/core';
import { Employee, Job, JobCenter} from "../../interfaces/employee.interface";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Router} from "@angular/router";
import { MatSnackBar} from "@angular/material/snack-bar";
import { MatDialog} from "@angular/material/dialog";
import { EmployeeService} from "../../services/employee.service";
import { switchMap} from "rxjs";
import {ConfirmComponent} from "../../../customer/components/confirm/confirm.component";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: [
  ]
})
export class AddComponent implements OnInit {

  // Inicilitazed Object Employees
  employee: Employee = {
    name: '',
    color: '',
    job_center: 0,
    job: 0,
    user: 1,
    avatar: '',
    signature: ''
  }

  // Fill Selects Center and Job
  jobCenters: JobCenter[] = []
  jobs: Job[] = []

  // Form Reactives Forms
  myForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    color: ['', [Validators.required]],
    job_center: [0, []],
    job: [0, []],
    user: [1, []],
    avatar: ['', []],
    signature: ['', []],
  })

  constructor( private formBuilder: FormBuilder,
               private employeeService : EmployeeService,
               private router: Router,
               private activateRoute: ActivatedRoute,
               private snackBar: MatSnackBar,
               private dialog: MatDialog) { }

  ngOnInit(): void {
    // Job Centers init
    this.employeeService.getJobCenters()
      .subscribe(jobCenters => {
        this.jobCenters = jobCenters.results
      } )

    // Type Jobs
    this.employeeService.getJobs()
      .subscribe(jobs => {
        this.jobs = jobs.results
      } )

    // Verificate Route For Edit or Add
    if (this.router.url === '/employee/add') { return }

    this.activateRoute.params
      .pipe(
        switchMap(({ id }) => this.employeeService.getEmployeeById( id ))
      )
      .subscribe(employee => {
        this.employee = employee
        this.myForm.get('name')?.setValue(employee.name)
        this.myForm.get('color')?.setValue(employee.color)
        this.myForm.get('avatar')?.setValue(employee.avatar)
        this.myForm.get('signature')?.setValue(employee.signature)
        this.myForm.get('job_center')?.setValue(employee.job_center)
        this.myForm.get('job')?.setValue(employee.job)
      } )

  }

  save(){
    if (this.employee.id)
    {
      this.myForm.addControl('id', new FormControl(this.employee.id))
      this.employeeService.updateEmployee(this.myForm.value)
        .subscribe(employee => {
          if (employee.id) {
            this.router.navigate(['/employee'])
            this.showSnackBar('Registro Actualizado')
          }
          else this.showSnackBar('Algo salió mal')
        })
    }
    else {
      // Add
      this.employeeService.addEmployee(this.myForm.value)
        .subscribe(employee => {
          if (employee.id) {
            this.router.navigate(['/employee'])
            this.showSnackBar('Registro Creado')
          }
          else this.showSnackBar('Algo salió mal')
        })
    }

  }

  delete(){
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: this.employee
    })

    dialog.afterClosed().subscribe(
      ( result ) => {
        if ( result ) {
          this.employeeService.deleteEmployee(this.employee.id!)
            .subscribe(resp => {
              this.router.navigate(['/employee'])
            })
        }
      })

  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000
    })
  }

}
