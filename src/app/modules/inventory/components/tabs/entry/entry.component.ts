import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {SharedService} from "../../../../../shared/services/shared.service";
import {Entry} from "../../../interfaces/inventory.interface";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {InventoryService} from "../../../services/inventory.service";
import {CrudComponent} from "../../crud/crud.component";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";
import {Employee, JobCenter} from "../../../../employee/interfaces/employee.interface";
import {Supplier} from "../../../../catalog/suppliers/interfaces/suppliers.interface";
import * as fileSaver from "file-saver";
import {DateService} from "../../../../../core/utils/date.service";

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styles: [
  ]
})
export class EntryComponent implements OnInit {

  displayedColumns: string[] = ['id', 'supplier', 'group', 'employee', 'amount', 'comments', 'date', 'options'];
  dataSource!: MatTableDataSource<Entry>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  paginateForm!: FormGroup;
  @ViewChild('paginator', {static: true}) paginator!: MatPaginator;
  employees!: Employee[];
  jobCenters!: JobCenter[];
  suppliers!: Supplier[];

  constructor(private sharedService: SharedService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private spinner: NgxSpinnerService,
              private inventoryService : InventoryService,
              private dateService: DateService)
  {
    this.loadDataEmployees();
    this.loadDataSuppliers();
    this.loadDataGroups();
  }

  ngOnInit(): void {
    this.loadFilterForm();
    this.dataSource = new MatTableDataSource();
    this.getEntriesPaginator(this.paginator);
    this.updateEventSharedService()
  }

  getEntriesPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.paginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.inventoryService.getEntries(this.paginateForm.value)
      .subscribe((entries) => {
          this.spinner.hide()
          this.dataSource.data = entries.data
          this.totalItems = entries.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /**
  * Open dialog for add and update lifting.
* @param edit
* @param idEntry
* @param info
*/
  openDialog(edit: boolean, idEntry: number | '', info: boolean): void {
    this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: false,
      maxWidth: '80vw',
      maxHeight: '100vh',
      width: '95%',
      data: {edit: edit, idEntry: idEntry, info: info}
    });
  }

  delete(data: Entry) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: data
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.inventoryService.deleteEntry(data.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getEntriesPaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Filter Customer and Search
   */
  filterSelect(){
    this.inventoryService.getEntries(this.paginateForm.value)
      .subscribe(res => {
        this.getEntriesPaginator(this.paginator);
      })
  }

  /**
   * Upload Data Table
   */
  loadFilterForm(): void {
    this.paginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize],
      employee: '',
      group: '',
      supplier: '',
      initial_date: '',
      final_date: ''
    })
  }

  cleanInput(){
    this.paginateForm.get('initial_date')?.setValue('');
    this.paginateForm.get('final_date')?.setValue('');
    this.getEntriesPaginator(this.paginator);

  }

  /**
   * Export Entries
   */
  reportEntries(){

    this.spinner.show()
    this.inventoryService.reportEntriesAll(this.paginateForm.value).subscribe(res => {
      let file = this.sharedService.createBlobToExcel(res);
      if (this.paginateForm.value.initial_date !== ''){
        let date_initial = this.dateService.getFormatDataDate(this.paginateForm.value.initial_date);
        let final_date = this.dateService.getFormatDataDate(this.paginateForm.value.final_date);
        fileSaver.saveAs(file, `Reporte-Entradas-General-${date_initial}-${final_date}`);
      }
      else {
        let date = this.dateService.getFormatDataDate(new Date());
        fileSaver.saveAs(file, `Reporte-Entradas-General-${date}`);
      }

      this.spinner.hide();
    }, (error => {
      this.spinner.hide()
      this.sharedService.errorDialog(error)
    }))
  }

  /**
   * Array from service for Employees
   */
  loadDataEmployees(){
    this.inventoryService.getEmployees().subscribe(employees => {this.employees = employees.data} )
  }

  /**
   * Array from service for Groups
   */
  loadDataSuppliers(){
    this.inventoryService.getSuppliers().subscribe(suppliers => {this.suppliers = suppliers.data} )
  }

  /**
   * Array from service for Groups
   */
  loadDataGroups(){
    this.inventoryService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
  }

  /**
   * Services Shared for update any Component
   */
  updateEventSharedService(){
    this.sharedService.changeEvent.subscribe(change => {
      this.getEntriesPaginator(this.paginator)
    })
  }

}
