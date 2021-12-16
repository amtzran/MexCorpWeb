import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Door} from "../../interfaces/door.interface";
import {DoorService} from "../../services/door.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmComponent} from "../../../employee/components/confirm/confirm.component";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerServiceService} from "../../../customer/services/customer-service.service";
import {map, Observable, switchMap} from "rxjs";

;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [
  ]
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'folio', 'name', 'observations', 'door_type','options'];
  dataSource!: MatTableDataSource<Door>;
  doorPaginateForm!: FormGroup;

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  totalitems: number = 0;
  pageSize = 10;
  @ViewChild(MatSort) sort!: MatSort;
  idCustomer!: string | null;
  private sub : any;

  constructor(private doorService: DoorService,
              private customerService: CustomerServiceService,
              private formBuilder: FormBuilder,
              private dialog : MatDialog,
              private snackBar: MatSnackBar,
              private activateRoute: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit(): void {
    // get Id Route Customer
    this.sub = this.activateRoute.paramMap.subscribe( params => {
      this.idCustomer = params.get('customer');
    })
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.loadDoorPaginateForm();
    this.getDoors(this.paginator);

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

  getDoors(event: any){
    const paginator: MatPaginator = event;
    this.doorPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.doorService.getDoors(this.doorPaginateForm.value,  this.idCustomer )
      .subscribe(doors => {
        this.dataSource.data = doors.results
        this.totalitems = doors.count;
      } )
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadDoorPaginateForm(): void{
    this.doorPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

  delete(door: Door){
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: door
    })

    dialog.afterClosed().subscribe(
      ( result ) => {
        if ( result ) {
          this.doorService.deleteDoor(door.id!)
            .subscribe(resp => {
              this.showSnackBar('Registro Eliminado')
              this.getDoors(this.paginator);
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
