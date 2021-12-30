import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Door} from "../../interfaces/door.interface";
import {DoorService} from "../../services/door.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {CustomerServiceService} from "../../../customers/services/customer-service.service";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {CrudComponent} from "../../components/crud/crud.component";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [`
    .tableResponsive{
      width: 100%;
      overflow-x: auto;
    }`
  ]
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'folio', 'name', 'observations', 'door_type_name','options'];
  dataSource!: MatTableDataSource<Door>;
  totalItems!: number;
  pageSize = 10;
  doorPaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  idCustomer!: string | null;
  private sub : any;

  constructor(private doorService: DoorService,
              private customerService: CustomerServiceService,
              private formBuilder: FormBuilder,
              private dialog : MatDialog,
              private sharedService: SharedService,
              private activateRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    // get Id Route Customer
    this.sub = this.activateRoute.paramMap.subscribe( params => {
      this.idCustomer = params.get('customer');
    })

    /*Formulario*/
    this.loadDoorFilterForm();

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.getDoorsPaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDoorsPaginator(event: any){
    const paginator: MatPaginator = event;
    this.doorPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.doorService.getDoors(this.doorPaginateForm.value,  this.idCustomer )
      .subscribe(doors => {
        this.dataSource.data = doors.data
        this.totalItems = doors.total;
      } )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteDoor(door: Door){
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
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getDoorsPaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idDoor
   * @param info
   */
  openDialogDoor(edit: boolean, idDoor: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idDoor: idDoor, info: info, idCustomer : this.idCustomer}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getDoorsPaginator(this.paginator);
      }
    });
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadDoorFilterForm(): void{
    this.doorPaginateForm = this.formBuilder.group({
      page: [],
      page_size: this.pageSize
    })
  }

}
