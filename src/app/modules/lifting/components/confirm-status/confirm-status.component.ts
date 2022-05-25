import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Quotation} from "../../interfaces/lifting.interface";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {LiftingService} from "../../services/lifting.service";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-confirm-status',
  templateUrl: './confirm-status.component.html',
  styles: [
  ]
})
export class ConfirmStatusComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfirmStatusComponent>,
              private liftingService: LiftingService,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              @Inject(MAT_DIALOG_DATA) public quotation : {row: Quotation, status: string}) { }

  ngOnInit(): void {
  }

  status(): void {
    this.spinner.show()
    this.liftingService.updateStatus(this.quotation.row.id, this.quotation.status)
      .subscribe(response => {
          this.spinner.hide()
          this.sharedService.showSnackBar('Se ha actualizado correctamente el status.');
          this.close();
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }

  /**
   * Close modal.
   */
  close(): void{
    this.sharedService.updateComponent();
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
