import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {ModelProduct, Product} from "../../interfaces/product.interface";
import {ProductService} from "../../services/product.service";
import {CrudComponent} from "../crud/crud.component";
import * as fileSaver from "file-saver";
import {DateService} from "../../../../../core/utils/date.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['key','name', 'description', 'unit', 'brand', 'cost', 'model', 'family','options'];
  dataSource!: MatTableDataSource<Product>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize
  productPaginateForm!: FormGroup;
  products!: Product[];
  idProduct: string = '';
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  constructor(private productService: ProductService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private dateService: DateService
              ) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    /*Form*/
    this.loadProductFilterForm();
    this.getProductsPaginator(this.paginator);
    this.loadDataProducts();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getProductsPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.productPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.productService.getProducts(this.productPaginateForm.value)
      .subscribe(
        (products: ModelProduct) => {
          this.spinner.hide()
          this.dataSource.data = products.data
          this.totalItems = products.meta.total;
        },
        (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      )
  }

  deleteProduct(product: Product) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: product
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.productService.deleteProduct(product.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getProductsPaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Open dialog for add and update product.
   * @param category
   * @param edit
   * @param idProduct
   * @param info
   */
  openDialogProduct(category: string, edit: boolean, idProduct: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {category: category, edit: edit, idProduct: idProduct, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getProductsPaginator(this.paginator);
      }
    });
  }

  /**
   * Export Excel Services Finalized
   */
  reportProducts(){
    this.spinner.show()
    this.productService.reportProducts(this.productPaginateForm.value).subscribe(res => {
        let file = this.sharedService.createBlobToExcel(res);
        let date_initial = this.dateService.getFormatDataDate(new Date())

        fileSaver.saveAs(file, `Reporte-Productos-${date_initial}`);

        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Array from service for Products
   */
  loadDataProducts(){
    this.productService.getProductsAll().subscribe(products => {this.products = products.data} )
  }
  /**
   * Filter Customer and Search
   */
  filterSelect(){
    this.productService.getProducts(this.productPaginateForm.value).subscribe(res => {
     this.getProductsPaginator(this.paginator);
    })
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadProductFilterForm(): void {
    this.productPaginateForm = this.formBuilder.group({
      page: [],
      page_size: this.pageSize,
      id: this.idProduct,
      key: '',
      category: '',
      brand: '',
      description: ''
    })
  }

}
