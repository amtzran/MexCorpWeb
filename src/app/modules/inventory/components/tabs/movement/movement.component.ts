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

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styles: [
  ]
})
export class MovementComponent implements OnInit {

  displayedColumns: string[] = ['id', 'movement', 'transfer', 'product', 'quantity', 'date', 'employee'];
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
              private inventoryService : InventoryService)
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
