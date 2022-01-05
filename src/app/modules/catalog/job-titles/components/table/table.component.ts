import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {JobTitle} from "../../models/job-title.interface";
import {JobTitleService} from "../../services/job-title.service";
import {CrudComponent} from "../crud/crud.component";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'options'];
  dataSource!: MatTableDataSource<JobTitle>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize
  jobTitlePaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private jobTitleService: JobTitleService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,) {
  }

  ngOnInit(): void {
    /*Formulario*/
    this.loadJobTitleFilterForm();
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.getJobTitlePaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getJobTitlePaginator(event: any) {
    const paginator: MatPaginator = event;
    this.jobTitlePaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.jobTitleService.getJobTitles(this.jobTitlePaginateForm.value)
      .subscribe(jobTitles => {
        this.spinner.hide()
        this.dataSource.data = jobTitles.data
        this.totalItems = jobTitles.meta.total;
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

  deleteJobTitle(jobTitle: JobTitle) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: jobTitle
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.jobTitleService.deleteJobTitle(jobTitle.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getJobTitlePaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idJobTitle
   * @param info
   */
  openDialogJobTitle(edit: boolean, idJobTitle: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idJobTitle: idJobTitle, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getJobTitlePaginator(this.paginator);
      }
    });
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadJobTitleFilterForm(): void {
    this.jobTitlePaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

}
