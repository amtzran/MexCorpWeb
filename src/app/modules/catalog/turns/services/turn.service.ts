import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {ModelTurn, TurnDetail, turnPaginate} from "../interfaces/turn.interface";

@Injectable({
  providedIn: 'root'
})
export class TurnService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Turn
  getTurnById(id: number) : Observable<TurnDetail> {
    return this.http.get<TurnDetail>(`${this.baseUrl}/turns/${id}`)
  }

  // Get Turns
  getTurns(filter: turnPaginate): Observable<ModelTurn> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelTurn>(`${this.baseUrl}/turns/`, {params})
  }

  // Add Turn
  addTurn(turn: FormData): Observable<TurnDetail> {
    return this.http.post<TurnDetail>(`${this.baseUrl}/turns/`, turn)
  }

  // Update Turn
  updateTurn(idTurn: number, turn: FormData) : Observable<TurnDetail> {
    return this.http.put<TurnDetail>(`${this.baseUrl}/turns/${idTurn}/`, turn)
  }

  // Delete Turn
  deleteTurn(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/turns/${id}`)
  }

}
