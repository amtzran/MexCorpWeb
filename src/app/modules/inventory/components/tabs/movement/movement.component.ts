import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Movement, Warehouse} from "../../../interfaces/inventory.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {SharedService} from "../../../../../shared/services/shared.service";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {InventoryService} from "../../../services/inventory.service";
import {Product} from "../../../../catalog/tools-services/interfaces/product.interface";
import {Employee} from "../../../../employee/interfaces/employee.interface";
import * as fileSaver from "file-saver";
import {DateService} from "../../../../../core/utils/date.service";

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styles: [
  ]
})
export class MovementComponent implements OnInit {

  displayedColumns: string[] = ['id', 'movement', 'origin_name', 'destiny_name', 'product', 'input', 'output', 'quantity', 'date', 'employee'];
  dataSource!: MatTableDataSource<Movement>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  paginateForm!: FormGroup;
  @ViewChild('paginator', {static: true}) paginator!: MatPaginator;
  products!: Product[];
  employees!: Employee[];
  warehouses!: Warehouse[];

  constructor(private sharedService: SharedService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private spinner: NgxSpinnerService,
              private inventoryService : InventoryService,
              private dateService: DateService)
  {
    this.loadDataProducts();
    this.loadDataWarehouses();
    this.loadDataEmployees();
  }

  ngOnInit(): void {
    this.loadFilterForm();
    this.dataSource = new MatTableDataSource();
    this.getMovementsPaginator(this.paginator);
  }

  getMovementsPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.paginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.inventoryService.getMovements(this.paginateForm.value)
      .subscribe((movements) => {
          this.spinner.hide()
          this.dataSource.data = movements.data
          this.totalItems = movements.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /**
   * Filter Customer and Search
   */
  filterSelect(){
    this.inventoryService.getMovements(this.paginateForm.value)
      .subscribe(res => {
        this.getMovementsPaginator(this.paginator);
      })
  }

  /**
   * Upload Data Table
   */
  loadFilterForm(): void {
    this.paginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize],
      product: '',
      movement: '',
      employee: '',
      origin: '',
      destiny: '',
      initial_date: '',
      final_date: ''
    })
  }

  /**
   * Export Stock
   */
  reportMovements(){

    this.spinner.show()
    this.inventoryService.reportMovementsAll(this.paginateForm.value).subscribe(res => {
      let file = this.sharedService.createBlobToExcel(res);
      if (this.paginateForm.value.initial_date !== ''){
        let date_initial = this.dateService.getFormatDataDate(this.paginateForm.value.initial_date);
        let final_date = this.dateService.getFormatDataDate(this.paginateForm.value.final_date);
        fileSaver.saveAs(file, `Reporte-Movimientos-General-${date_initial}-${final_date}`);
      }
      else {
        let date = this.dateService.getFormatDataDate(new Date());
        fileSaver.saveAs(file, `Reporte-Movimientos-General-${date}`);
      }

      this.spinner.hide();
    }, (error => {
      this.spinner.hide()
      this.sharedService.errorDialog(error)
    }))
  }

  /**
   * Array from service for Products
   */
  loadDataProducts(){
    this.inventoryService.getRepairsAll().subscribe(products => {this.products = products.data} )
  }

  /**
   * Array from service for Warehouses
   */
  loadDataWarehouses(){
    this.inventoryService.getWarehouses().subscribe(warehouses => {this.warehouses = warehouses.data} )
  }

  /**
   * Array from service for Employees
   */
  loadDataEmployees(){
    this.inventoryService.getEmployees().subscribe(employees => {this.employees = employees.data} )
  }

}
