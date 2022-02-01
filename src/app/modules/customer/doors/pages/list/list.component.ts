import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Door, DoorType} from "../../interfaces/door.interface";
import {DoorService} from "../../services/door.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {CustomerServiceService} from "../../../customers/services/customer-service.service";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {CrudComponent} from "../../components/crud/crud.component";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";
import {CustomerTitle} from "../../../customers/interfaces/customer.interface";
import {NgxSpinnerService} from "ngx-spinner";
import * as fileSaver from "file-saver";
import {DateService} from "../../../../../core/utils/date.service";
import {DoorTypeService} from "../../../../catalog/door-types/services/door-type.service";

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

  displayedColumns: string[] = ['id', 'folio', 'name', 'observations', 'brand', 'model', 'door_type_name', 'options'];
  dataSource!: MatTableDataSource<Door>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize
  doorPaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  idCustomer!: string | null;
  private sub : any;
  doorTypes!: DoorType[];
  filterForm!: FormGroup;
  submit!: boolean;
  customer: CustomerTitle = {
    name : '',
  };

  constructor(private doorService: DoorService,
              private customerService: CustomerServiceService,
              private formBuilder: FormBuilder,
              private dialog : MatDialog,
              private sharedService: SharedService,
              private activateRoute: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private dateService: DateService,
              private doorTypeService: DoorTypeService,
              ) {}

  ngOnInit(): void {
    // get Id Route Customer
    this.sub = this.activateRoute.paramMap.subscribe( params => {
      this.idCustomer = params.get('customer');
    })
    /**
     * Detail Data Customer
     */
    this.customerService.getCustomerById(Number(this.idCustomer)).subscribe(customer =>{
        this.customer = customer.data
      }
    )
    /*Formulario*/
    this.loadDoorFilterForm();
    this.loadFilterForm();
    this.loadDoorTypes();

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.getDoorsPaginator(this.paginator);

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getDoorsPaginator(event: any){
    const paginator: MatPaginator = event;
    this.doorPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.doorService.getDoors(this.doorPaginateForm.value,  this.idCustomer )
      .subscribe(doors => {
        this.spinner.hide()
        this.dataSource.data = doors.data
        this.totalItems = doors.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog()
        } )
      )
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

  /**
   * Export Excel and Pdf with filters
   * @param type
   */
  downloadReport(type: string){
    this.validateForm()
    this.spinner.show()
    this.doorService.exportReportDoorsBYCustomer(this.filterForm.value, type).subscribe(res => {
        let file : any;
        if (type === 'excel') file = this.sharedService.createBlobToExcel(res);
        else file = this.sharedService.createBlobToPdf(res);
        let currentDate = new Date();
        let date_initial, final_date;
        if (this.filterForm.value.initial_date) {
          date_initial = this.dateService.getFormatDataDate(this.filterForm.value.initial_date)
          final_date = this.dateService.getFormatDataDate(this.filterForm.value.final_date)
        }
        else {
          date_initial = this.dateService.getFormatDataDate(currentDate);
          final_date = this.dateService.getFormatDataDate(currentDate);
        }

        fileSaver.saveAs(file, `Reporte-Accesos-${date_initial}-${final_date}`);

        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog()
      })
    )
  }

  /**
   * load Form Reactive Form
   */
  loadFilterForm() : void {
    this.filterForm = this.formBuilder.group({
      initial_date: [{value: '', disabled:false},],
      final_date: [{value: '', disabled:false},],
      customer: [{value: this.idCustomer, disabled:false},],
      door_type: [{value: '', disabled:false},],
    });
  }

  /**
   * Validate form in general
   */
  validateForm(){
    this.submit = true;
    if(this.filterForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Service Customer Types
   */
  loadDoorTypes(){
    this.doorTypeService.getDoorTypes(this.doorPaginateForm.value).subscribe(doorTypes => {this.doorTypes = doorTypes.data} )
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadDoorFilterForm(): void{
    this.doorPaginateForm = this.formBuilder.group({
      page: [],
      page_size: this.pageSize
    })
  }

}
