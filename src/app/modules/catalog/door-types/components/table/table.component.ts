import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {DoorType} from "../../models/door-type.interface";
import {DoorTypeService} from "../../services/door-type.service";
import {CrudComponent} from "../crud/crud.component";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'options'];
  dataSource!: MatTableDataSource<DoorType>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize
  doorTypePaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private doorTypeService: DoorTypeService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService) {
  }

  ngOnInit(): void {
    /*Formulario*/
    this.loadDoorTypeFilterForm();
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.getDoorTypePaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getDoorTypePaginator(event: any) {
    const paginator: MatPaginator = event;
    this.doorTypePaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.doorTypeService.getDoorTypes(this.doorTypePaginateForm.value)
      .subscribe(doorTypes => {
        this.dataSource.data = doorTypes.data
        this.totalItems = doorTypes.meta.total;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteDoorType(doorType: DoorType) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: doorType
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.doorTypeService.deleteDoorType(doorType.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getDoorTypePaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idDoorType
   * @param info
   */
  openDialogDoorType(edit: boolean, idDoorType: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idDoorType: idDoorType, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getDoorTypePaginator(this.paginator);
      }
    });
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadDoorTypeFilterForm(): void {
    this.doorTypePaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

}
