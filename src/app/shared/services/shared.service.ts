import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentCustomer} from "../../modules/customer/comments/models/comment.interface";
import {ConfirmComponent} from "../components/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponent} from "../components/error/error.component";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog,) {}

  /**
   * Generate new snack bar with custom message.
   * @param msg
   */
  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000
    })
  }

  errorDialog() {
    // Show Dialog
    const dialog = this.dialog.open(ErrorComponent, {
      width: '250',
      data: 'error'
    })

  }

  /**
   * Default Paginate Tables
   */
  pageSize = 10;

}
