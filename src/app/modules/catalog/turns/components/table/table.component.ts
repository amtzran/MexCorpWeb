import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ModelProduct, Product} from "../../../products/interfaces/product.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DateService} from "../../../../../core/utils/date.service";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";
import {TurnService} from "../../services/turn.service";
import {ModelTurn, Turn} from "../../interfaces/turn.interface";
import {AddUpdateComponent} from "../add-update/add-update.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id','name', 'initial_hour', 'final_hour', 'options'];
  dataSource!: MatTableDataSource<Product>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;
  turnPaginateForm!: FormGroup;
  dateNow = new Date();
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  constructor(private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private dateService: DateService,
              private turnService: TurnService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.loadTurnFilterForm();
    this.getTurnsPaginator(this.paginator);
  }

  getTurnsPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.turnPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.turnService.getTurns(this.turnPaginateForm.value)
      .subscribe(
        (turns: ModelTurn) => {
          this.spinner.hide()
          this.dataSource.data = turns.data
          this.totalItems = turns.meta.total;
        },
        (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      )
  }

  /**
   * Open dialog for add and update product.
   * @param edit
   * @param idTurn
   * @param info
   */
  openDialogTurn(edit: boolean, idTurn: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(AddUpdateComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idTurn: idTurn, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getTurnsPaginator(this.paginator);
      }
    });
  }

  /**
   * Open dialog delete turn.
   * @param turn
   */
  deleteTurn(turn: Turn) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: turn
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.turnService.deleteTurn(turn.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getTurnsPaginator(this.paginator);
            })
        }
      })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadTurnFilterForm(): void {
    this.turnPaginateForm = this.formBuilder.group({
      page: [],
      page_size: this.pageSize,
    })
  }

}
