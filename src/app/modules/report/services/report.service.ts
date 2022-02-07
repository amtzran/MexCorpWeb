import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";;

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor( private http: HttpClient,) { }
  private baseUrl: string = environment.baseUrl

}
