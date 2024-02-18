import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {SharedService} from "../../../../../shared/services/shared.service";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {InventoryService} from "../../../services/inventory.service";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";
import {Employee, JobCenter} from "../../../../employee/interfaces/employee.interface";
import {Supplier} from "../../../../catalog/suppliers/interfaces/suppliers.interface";
import {DateService} from "../../../../../core/utils/date.service";
import { Output } from '../../../interfaces/inventory.interface';
import * as fileSaver from "file-saver";
import { CrudOutputComponent } from '../../crud-output/crud-output.component';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html'
})
export class OutputComponent implements OnInit {

  displayedColumns: string[] = ['id', 'group', 'destination', 'employee', 'amount', 'date', 'options'];
  dataSource!: MatTableDataSource<Output>;
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
    this.loadDataGroups();
  }

  ngOnInit(): void {
    this.loadFilterForm();
    this.dataSource = new MatTableDataSource();
    this.getOutputsPaginator(this.paginator);
    this.updateEventSharedService()
  }

  getOutputsPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.paginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.inventoryService.getOutputs(this.paginateForm.value)
      .subscribe((outputs) => {
          this.spinner.hide()
          this.dataSource.data = outputs.data
          this.totalItems = outputs.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /**
  * Open dialog for add and update lifting.
  * @param edit
  * @param idOutput
  * @param info
  */
  openDialog(edit: boolean, idOutput: number | '', info: boolean): void {
    this.dialog.open(CrudOutputComponent, {
      autoFocus: false,
      disableClose: false,
      maxWidth: '80vw',
      maxHeight: '100vh',
      width: '95%',
      data: {edit: edit, idOutput: idOutput, info: info}
    });
  }

  delete(data: Output) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: data
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.inventoryService.deleteOutput(data.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getOutputsPaginator(this.paginator);
            })
        }
      })
  }

  /**
   * Filter Customer and Search
   */
  filterSelect(){
    this.inventoryService.getOutputs(this.paginateForm.value)
      .subscribe(res => {
        this.getOutputsPaginator(this.paginator);
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
      destination: '',
      initial_date: '',
      final_date: ''
    })
  }

  cleanInput(){
    this.paginateForm.get('initial_date')?.setValue('');
    this.paginateForm.get('final_date')?.setValue('');
    this.getOutputsPaginator(this.paginator);

  }

  /**
   * Export Outputs
   */
  reportOutputs(){

    this.spinner.show()
    this.inventoryService.reportOutputsAll(this.paginateForm.value).subscribe(res => {
      let file = this.sharedService.createBlobToExcel(res);
      if (this.paginateForm.value.initial_date !== ''){
        let date_initial = this.dateService.getFormatDataDate(this.paginateForm.value.initial_date);
        let final_date = this.dateService.getFormatDataDate(this.paginateForm.value.final_date);
        fileSaver.saveAs(file, `Reporte-Salidas-General-${date_initial}-${final_date}`);
      }
      else {
        let date = this.dateService.getFormatDataDate(new Date());
        fileSaver.saveAs(file, `Reporte-Salidas-General-${date}`);
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
  loadDataGroups(){
    this.inventoryService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
  }

  /**
   * Services Shared for update any Component
   */
  updateEventSharedService(){
    this.sharedService.changeEvent.subscribe(change => {
      this.getOutputsPaginator(this.paginator)
    })
  }

}
