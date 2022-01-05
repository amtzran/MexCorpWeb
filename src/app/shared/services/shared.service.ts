import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Generate new snack bar with custom message.
   * @param msg
   */
  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000
    })
  }

  /**
   * Default Paginate Tables
   */
  pageSize = 10;

}
