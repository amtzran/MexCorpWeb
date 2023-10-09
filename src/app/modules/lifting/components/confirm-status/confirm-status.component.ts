import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Quotation} from "../../interfaces/lifting.interface";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {LiftingService} from "../../services/lifting.service";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-confirm-status',
  templateUrl: './confirm-status.component.html',
  styles: [
  ]
})
export class ConfirmStatusComponent implements OnInit {

  statusForm!: FormGroup;
  pending = 'Pendiente por Aprobar';
  approve = 'Aprobada';

  constructor(private dialogRef: MatDialogRef<ConfirmStatusComponent>,
              private liftingService: LiftingService,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public quotation : {row: Quotation, type: string}) { }

  ngOnInit(): void {
    console.log(this.quotation.row)
    if (this.quotation.type === 'Pending') this.loadStatusForm();
    if (this.quotation.type === 'Approve') this.loadStatusForm2();
  }

  /**
   * Load the form Task.
   */
  loadStatusForm():void{
    this.statusForm = this.formBuilder.group({
      status:[{value: this.pending, disabled:false}, [Validators.required]],
    });
  }

  loadStatusForm2():void{
    this.statusForm = this.formBuilder.group({
      status:[{value: this.approve , disabled:false}, [Validators.required]],
      delivery_time:[{value: '' , disabled:false}, [Validators.required]],
      payment_conditions:[{value: '' , disabled:false}, [Validators.required]],
    });
  }

  status(): void {
    this.spinner.show()
    this.liftingService.updateStatus(this.quotation.row.id, this.statusForm.value)
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
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.statusForm.get(field)?.invalid &&
      this.statusForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.sharedService.updateComponent();
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
