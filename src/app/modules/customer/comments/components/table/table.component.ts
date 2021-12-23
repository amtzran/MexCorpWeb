import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ActivatedRoute} from "@angular/router";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {CrudComponent} from "../crud/crud.component";
import {CommentService} from "../../services/comment.service";
import {CommentCustomer} from "../../models/comment.interface";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'comment', 'updated_at','options'];
  dataSource!: MatTableDataSource<CommentCustomer>;
  totalItems: number = 0;
  pageSize = 10;
  idCustomer!: string | null;
  commentPaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private commentService: CommentService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    // get Id Route Customer
    this.activateRoute.paramMap.subscribe( params => {
      this.idCustomer = params.get('customer');
    })
    /*Formulario*/
    this.loadCommentFilterForm();
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.getCommentsPaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCommentsPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.commentPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.commentService.getComments(this.commentPaginateForm.value, Number(this.idCustomer))
      .subscribe(comments => {
        this.dataSource.data = comments.results
        this.totalItems = comments.count;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteComment(comment: CommentCustomer) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: comment
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.commentService.deleteComment(comment.id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getCommentsPaginator(this.paginator);
            })
        }
      })

  }

  /**
   * Open dialog for add and update Comments.
   * @param edit
   * @param idComment
   * @param info
   */
  openDialogComment(edit: boolean, idComment: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idComment: idComment, info: info, idCustomer : this.idCustomer}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getCommentsPaginator(this.paginator);
      }
    });
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadCommentFilterForm(): void {
    this.commentPaginateForm = this.formBuilder.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

}
