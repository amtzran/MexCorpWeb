import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource} from "@angular/material/table";
import { FormBuilder, FormGroup} from "@angular/forms";
import { MatPaginator} from "@angular/material/paginator";
import { MatSort} from "@angular/material/sort";
import { Employee} from "../../interfaces/employee.interface";
import { MatDialog} from "@angular/material/dialog";
import { MatSnackBar} from "@angular/material/snack-bar";
import { EmployeeService} from "../../services/employee.service";
import { ConfirmComponent} from "../../components/confirm/confirm.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [
  ]
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'color', 'signature', 'options'];
  dataSource!: MatTableDataSource<Employee>;
  employeePaginateForm!: FormGroup;

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  totalitems: number = 0;
  pageSize = 10;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService,
              private formBuilder: FormBuilder,
              private dialog : MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.loadEmployeePaginateForm();
    this.getEmployees(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEmployees(event: any){
    const paginator: MatPaginator = event;
    this.employeePaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.employeeService.getEmployees(this.employeePaginateForm.value)
      .subscribe(employees => {
        this.dataSource.data = employees.results
        this.totalitems = employees.count;
      } )
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadEmployeePaginateForm(): void{
    this.employeePaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

  delete(employee: Employee){
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: employee
    })

    dialog.afterClosed().subscribe(
      ( result ) => {
        if ( result ) {
          this.employeeService.deleteEmployee(employee.id!)
            .subscribe(resp => {
              this.showSnackBar('Registro Eliminado')
              this.getEmployees(this.paginator);
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
