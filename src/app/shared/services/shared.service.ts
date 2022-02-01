import {EventEmitter, Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponent} from "../components/error/error.component";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog,) {}

  // Default Paginate tables
  pageSize = 10;
  // Listen event boolean for update from components from son
  changeEvent = new EventEmitter<boolean>()

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
   * Component Error
   */
  errorDialog() {
    // Show Dialog
    const dialog = this.dialog.open(ErrorComponent, {
      width: '250',
      data: 'error'
    })

  }

  /**
   * Method for called update Component Main
   */
  updateComponent(){
    this.changeEvent.emit(true)
  }

  /**
   * Export Data excel
   * @param data
   */
  createBlobToExcel(data: any){
    return new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  /**
   * Export Data Pdf
   * @param data
   */
  createBlobToPdf(data: any){
    return new Blob([data], { type: 'application/pdf' });
  }

}
