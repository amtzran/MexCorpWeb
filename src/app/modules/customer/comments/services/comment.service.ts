import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {CommentCustomerDetail, CommentPaginate, ModelComment} from "../models/comment.interface";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Comment
  getCommentById(id: number) : Observable<CommentCustomerDetail> {
    return this.http.get<CommentCustomerDetail>(`${this.baseUrl}/customer-comments/${id}`)
  }

  // Get Comments
  getComments(filter: CommentPaginate, customerId: number): Observable<ModelComment> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    customerId ? params = params.append('customer', customerId) : null;
    return this.http.get<ModelComment>(`${this.baseUrl}/customer-comments/`, {params})
  }

  // Add Comment
  addComment(comment: CommentCustomerDetail): Observable<CommentCustomerDetail> {
    return this.http.post<CommentCustomerDetail>(`${this.baseUrl}/customer-comments/`, comment)
  }

  // Update Comment
  updateComment(idComment: number, comment: CommentCustomerDetail) : Observable<CommentCustomerDetail> {
    return this.http.put<CommentCustomerDetail>(`${this.baseUrl}/customer-comments/${idComment}/`,comment)
  }

  // Delete Comment
  deleteComment(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/customer-comments/${id}`)
  }

}
