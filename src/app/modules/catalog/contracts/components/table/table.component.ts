import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {Contract, ModelContract} from "../../models/contract.interface";
import {ContractService} from "../../services/contract.service";
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
export class TableComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'options'];
  dataSource!: MatTableDataSource<Contract>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize
  contractPaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private contractService: ContractService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              ) {
  }

  ngOnInit(): void {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    /*Formulario*/
    this.loadContractFilterForm();
    this.getContractsPaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getContractsPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.contractPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.contractService.getContracts(this.contractPaginateForm.value)
      .subscribe(
        (contracts: ModelContract) => {
        this.spinner.hide()
        this.dataSource.data = contracts.data
        this.totalItems = contracts.meta.total;
        },
        (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteContract(contract: Contract) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: contract
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.contractService.deleteContract(contract.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getContractsPaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idContract
   * @param info
   */
  openDialogContract(edit: boolean, idContract: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idContract: idContract, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getContractsPaginator(this.paginator);
      }
    });
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadContractFilterForm(): void {
    this.contractPaginateForm = this.formBuilder.group({
      page: [],
      page_size: this.pageSize
    })
  }

}
