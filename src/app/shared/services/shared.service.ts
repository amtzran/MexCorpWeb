import {EventEmitter, Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponent} from "../components/error/error.component";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Permission} from "../interfaces/shared.interface";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,) {}

  private baseUrl: string = environment.baseUrl

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
  errorDialog(error: any) {
    // Show Dialog
    this.dialog.open(ErrorComponent, {
      width: '250',
      data: error
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

  /**
   * Get Permissions
   */
  getPermissions() : Observable<Permission> {
    return this.http.get<Permission>(`${this.baseUrl}/permissions/`)
  }

}
