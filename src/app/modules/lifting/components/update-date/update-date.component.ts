import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LiftingService} from "../../services/lifting.service";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Quotation} from "../../interfaces/lifting.interface";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {DateService} from "../../../../core/utils/date.service";

@Component({
  selector: 'app-update-date',
  templateUrl: './update-date.component.html',
  styleUrls: ['./update-date.component.css']
})
export class UpdateDateComponent implements OnInit {

  statusForm!: FormGroup;
  object: any;

  constructor(private dialogRef: MatDialogRef<UpdateDateComponent>,
              private liftingService: LiftingService,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService,
              private formBuilder: FormBuilder,
              private dateService: DateService,
              @Inject(MAT_DIALOG_DATA) public quotation : {row: Quotation, type: string}) { }

  ngOnInit(): void {
    console.log(this.quotation.row)
    this.loadStatusForm();
  }

  /**
   * Load the form Task.
   */
  loadStatusForm():void{
    this.statusForm = this.formBuilder.group({
      date:[{value: this.quotation.row.date, disabled:false}, [Validators.required]],
      observations:[{value: '', disabled:false}, [Validators.required]],
    });
  }

  update(): void {
    this.validateData()
    if (this.statusForm.invalid) return
    this.spinner.show()
    this.liftingService.updateDate(this.quotation.row.id, this.object)
      .subscribe(response => {
          this.spinner.hide()
          this.sharedService.showSnackBar('Se ha actualizado correctamente la fecha.');
          this.close();
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )

  }

  validateData() : void {
    this.object = this.statusForm.value

    this.object.date = this.dateService.getFormatDataDate(this.statusForm.get('date')?.value)
    console.log(this.object)

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
