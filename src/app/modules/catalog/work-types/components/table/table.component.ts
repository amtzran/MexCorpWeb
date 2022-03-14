import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {WorkType} from "../../models/work-type.interface";
import {WorkTypeService} from "../../services/work-type.service";
import {CrudComponent} from "../crud/crud.component";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'cost_one', 'cost_two', 'options'];
  dataSource!: MatTableDataSource<WorkType>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize
  workTypePaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private workTypeService: WorkTypeService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,) {
  }

  ngOnInit(): void {
    /*Formulario*/
    this.loadWorkTypeFilterForm();
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.getWorkTypePaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getWorkTypePaginator(event: any) {
    const paginator: MatPaginator = event;
    this.workTypePaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.workTypeService.getWorkTypes(this.workTypePaginateForm.value)
      .subscribe(workTypes => {
        this.spinner.hide()
        this.dataSource.data = workTypes.data
        this.totalItems = workTypes.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
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

  deleteWorkType(workType: WorkType) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: workType
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.workTypeService.deleteWorkType(workType.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getWorkTypePaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idWorkType
   * @param info
   */
  openDialogWorkType(edit: boolean, idWorkType: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idWorkType: idWorkType, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getWorkTypePaginator(this.paginator);
      }
    });
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadWorkTypeFilterForm(): void {
    this.workTypePaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

}
