import {Component, Inject, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {DoorByTask, PhotoByDoor} from "../../models/task.interface";
import {TaskService} from "../../services/task.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedService} from "../../../../shared/services/shared.service";
import {ModalResponse} from "../../../../core/utils/ModalResponse";

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent implements OnInit {

  /*Titulo Modal*/
  title!: string;
  displayedColumns: string[] = ['id', 'section','photo', 'options'];
  dataSource!: MatTableDataSource<DoorByTask[]>;

  constructor(private taskService: TaskService,
              private spinner: NgxSpinnerService,
              private dialogRef: MatDialogRef<ImageDetailComponent>,
              private sharedService: SharedService,
              @Inject(MAT_DIALOG_DATA) public data : DoorByTask) { }

  ngOnInit(): void {
    this.spinner.show()
    this.dataSource = new MatTableDataSource();
    this.getDoorsPaginator();
    this.spinner.hide()
  }

  /**
   * Get Data for table from Api
   */
  getDoorsPaginator() {
    this.title = this.data.name
    this.dataSource = this.data.photos
  }

  viewImg(imgUrl: string){
    window.open(imgUrl)
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.CLOSE);
  }

}
