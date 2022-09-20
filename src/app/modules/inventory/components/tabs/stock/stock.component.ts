import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Entry, Warehouse} from "../../../interfaces/inventory.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {SharedService} from "../../../../../shared/services/shared.service";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {InventoryService} from "../../../services/inventory.service";
import {Product} from "../../../../catalog/tools-services/interfaces/product.interface";
import * as fileSaver from "file-saver";
import {DateService} from "../../../../../core/utils/date.service";

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styles: [
  ]
})
export class StockComponent implements OnInit {

  displayedColumns: string[] = ['id', 'warehouse', 'repair', 'date'];
  dataSource!: MatTableDataSource<Warehouse>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  paginateForm!: FormGroup;
  @ViewChild('paginator', {static: true}) paginator!: MatPaginator;
  products!: Product[];
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
  }

  ngOnInit(): void {
    this.loadFilterForm();
    this.dataSource = new MatTableDataSource();
    this.getStocksPaginator(this.paginator);
  }

  getStocksPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.paginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.inventoryService.getStocks(this.paginateForm.value)
      .subscribe((warehouses) => {
          this.spinner.hide()
          this.dataSource.data = warehouses.data
          this.totalItems = warehouses.meta.total;
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
    this.inventoryService.getStocks(this.paginateForm.value)
      .subscribe(res => {
        this.getStocksPaginator(this.paginator);
      })
  }

  /**
   * Export Stock
   */
  reportStocks(){

    this.spinner.show()
    this.inventoryService.reportStocksAll(this.paginateForm.value).subscribe(res => {
      let file = this.sharedService.createBlobToExcel(res);
      if (this.paginateForm.value.initial_date !== ''){
        let date_initial = this.dateService.getFormatDataDate(this.paginateForm.value.initial_date);
        let final_date = this.dateService.getFormatDataDate(this.paginateForm.value.final_date);
        fileSaver.saveAs(file, `Reporte-Existencias-General-${date_initial}-${final_date}`);
      }
      else {
        let date = this.dateService.getFormatDataDate(new Date());
        fileSaver.saveAs(file, `Reporte-Existencia-General-${date}`);
      }

      this.spinner.hide();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      }))
  }

  /**
   * Upload Data Table
   */
  loadFilterForm(): void {
    this.paginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize],
      warehouse: '',
      product: '',
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
   * Array from service for Employees
   */
  loadDataWarehouses(){
    this.inventoryService.getWarehouses().subscribe(warehouses => {this.warehouses = warehouses.data} )
  }


}
