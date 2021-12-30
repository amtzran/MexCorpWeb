import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GroupService} from "../../services/groups.service";
import {MatDialog} from "@angular/material/dialog";
import {Group} from "../../models/group.interface";
import {DialogAddGroupComponent} from "../dialog-add-group/dialog-add-group.component";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ConfirmComponent} from "../../../../../shared/components/confirm/confirm.component";

@Component({
  selector: 'app-table-group',
  templateUrl: './table-group.component.html',
  styles: [`
  .tableResponsive{
    width: 100%;
    overflow-x: auto;
  }
  `]
})
export class TableGroupComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'reason_social', 'rfc', 'phone', 'email', 'address', 'options'];
  dataSource!: MatTableDataSource<Group>;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  totalItems!: number;
  pageSize = this.sharedService.pageSize;

  /* Variable de Filtros */
  groupFilterForm!: FormGroup

  constructor(
    private sharedService: SharedService,
    private _groupService: GroupService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    /*Formulario*/
    this.loadGroupFilterForm();

    /*Tabla*/
    this.dataSource = new MatTableDataSource();
    this.loadGroupsPaginator(this.paginator);
  }

  /**
   * Get all groups and load data table.
   * @param event
   */
  loadGroupsPaginator(event: any): void {
    const paginator: MatPaginator = event;
    this.groupFilterForm.get('page')?.setValue(paginator.pageIndex + 1);
    this._groupService.getGroups(this.groupFilterForm.value).subscribe(response => {
      this.dataSource.data = response.data;
      this.totalItems = response.meta.total;
    });
  }

  /**
   * Delete a group.
   * @param group
   */
  deleteGroup(group: Group): void {
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: group
    });

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this._groupService.deleteGroup(group.id!)
            .subscribe(response => {
              this.sharedService.showSnackBar('Grupo Eliminado');
              this.loadGroupsPaginator(this.paginator);
            })
        }
      });
  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idGroup
   * @param info
   */
  openDialogGroup(edit: boolean, idGroup: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(DialogAddGroupComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idGroup: idGroup, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.loadGroupsPaginator(this.paginator);
      }
    });
  }

  /**
   * Load filter form.
   */
  loadGroupFilterForm(): void {
    this.groupFilterForm = this.fb.group({
      page: [],
      page_size: [this.pageSize]
    })
  }

}
