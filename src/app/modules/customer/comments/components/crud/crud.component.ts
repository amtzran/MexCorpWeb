import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedService} from "../../../../../shared/services/shared.service";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {CommentService} from "../../services/comment.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  commentForm!: FormGroup;

  /*Titulo Modal*/
  menuTitle: string = 'Comentario'
  title: string = `Nuevo ${this.menuTitle}`;

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _commentService: CommentService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public comment : {idComment: number, edit: boolean, info: boolean, idCustomer: number}
  ) { }

  ngOnInit(): void {

    /*Formulario*/
    this.loadContractForm();

    if(this.comment.idComment && this.comment.edit){
      this.title = `Editar ${this.menuTitle}`;
      this.commentForm.updateValueAndValidity();
    }

    if(this.comment.idComment && !this.comment.edit){
      this.title = `Información del ${this.menuTitle}`;
      this.commentForm.updateValueAndValidity();
    }

    if(this.comment.idComment){
      this.loadContractById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadContractById(): void{
    this.spinner.show()
    this._commentService.getCommentById(this.comment.idComment).subscribe(response => {
      this.spinner.hide()
      delete response.data.id;
      delete response.data.created_at;
      delete response.data.updated_at;
      delete response.data.user_id;
      delete response.data.customer_name;
      this.commentForm.setValue(response.data);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog()
      } )
    )
  }

  /**
   * Load the form Comment.
   */
  loadContractForm():void{
    this.commentForm = this.fb.group({
      comment:[{value:'', disabled:this.comment.info}, Validators.required],
      customer_id: [{value: this.comment.idCustomer, disabled:this.comment.info}],
      user_name: [{value: '', disabled:true, }]
    });
  }

  /**
   * Create Comment.
   */
  addComment(): void {
    this.validateForm()
    this.spinner.show()
    this._commentService.addComment(this.commentForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha agregado correctamente el ${this.menuTitle}.`);
      this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog()
      })
    )
  }

  /**
   * Update a comment.
   */
  updateComment(): void {
    this.validateForm()
    this.spinner.show()
    this._commentService.updateComment(this.comment.idComment, this.commentForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el ${this.menuTitle}: ${response.data.comment}` );
      this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog()
      })
    )
  }

  /**
   * Validate form in general
   */
  validateForm(){
    this.submit = true;
    if(this.commentForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.commentForm.get(field)?.invalid && this.commentForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
