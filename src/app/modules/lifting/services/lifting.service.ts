import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {
  EmailSend,
  Lifting,
  liftingDetail,
  LiftingPaginate,
  ModelLifting,
  ModelQuotation, ModelQuotationConcept,
  QuotationConcept, QuotationConceptDetail, QuotationtDetail
} from "../interfaces/lifting.interface";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class LiftingService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Lifting
  getLiftingById(id: number | null) : Observable<liftingDetail> {
    return this.http.get<liftingDetail>(`${this.baseUrl}/liftings/${id}/`)
  }

  // Get Liftings
  getLiftings(filter: LiftingPaginate): Observable<ModelLifting> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.folio ? params = params.append('folio', filter.folio) : null;
    filter.customer ? params = params.append('customer', filter.customer) : null;
    filter.employee ? params = params.append('employee', filter.employee) : null;
    filter.group ? params = params.append('group', filter.group) : null;
    filter.work_type ? params = params.append('work_type', filter.work_type) : null;
    filter.status ? params = params.append('status', filter.status) : null;
    filter.initial_date ? params = params.append('initial_date', filter.initial_date) : null;
    filter.final_date ? params = params.append('final_date', filter.final_date) : null;
    return this.http.get<ModelLifting>(`${this.baseUrl}/liftings/`, {params})
  }

  // Add Lifting
  addLifting(lifting: FormData): Observable<liftingDetail> {
    return this.http.post<liftingDetail>(`${this.baseUrl}/liftings/`, lifting)
  }

  // Update Lifting
  updateLifting(idLifting : number, lifting: FormData) : Observable<liftingDetail> {
    return this.http.post<liftingDetail>(`${this.baseUrl}/liftings/${idLifting}/`, lifting)
  }

  addQuotation(quotation: Lifting) : Observable<any> {
    let quote = {
      lifting_id : quotation.id,
      seller_id: quotation.employee_id
    };
    return this.http.post<any>(`${this.baseUrl}/quotes/`, quote)
  }

  saveQuote(data: any) : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/quotes/new`, data)
  }

  generatePdfQuote(id: number | null) : Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/quotes-pdf/${id}`)
  }

  // Get Quotations
  getQuotations(filter: LiftingPaginate): Observable<ModelQuotation> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.folio ? params = params.append('folio', filter.folio) : null;
    filter.customer ? params = params.append('customer', filter.customer) : null;
    filter.employee ? params = params.append('employee', filter.employee) : null;
    filter.group ? params = params.append('group', filter.group) : null;
    filter.work_type ? params = params.append('work_type', filter.work_type) : null;
    filter.status ? params = params.append('status', filter.status) : null;
    filter.initial_date ? params = params.append('initial_date', filter.initial_date) : null;
    filter.final_date ? params = params.append('final_date', filter.final_date) : null;
    return this.http.get<ModelQuotation>(`${this.baseUrl}/quotes/`, {params})
  }

  // Update Discount Quotation
  updateDiscount(idQuote : any, discount: FormGroup) : Observable<QuotationtDetail> {
    return this.http.put<QuotationtDetail>(`${this.baseUrl}/quotes-discount/${idQuote}/`, discount)
  }

  // Get Quote
  getQuoteById(id: number | undefined) : Observable<QuotationtDetail> {
    return this.http.get<QuotationtDetail>(`${this.baseUrl}/quotes/${id}`)
  }

  // Add Concept Quotation
  addConcept(conceptQuote: QuotationConcept): Observable<QuotationConceptDetail> {
    return this.http.post<QuotationConceptDetail>(`${this.baseUrl}/quote-concepts/`, conceptQuote)
  }

  // Update Concept Quotation
  updateConcept(idQuote : any, concept: FormGroup) : Observable<QuotationConceptDetail> {
    return this.http.put<QuotationConceptDetail>(`${this.baseUrl}/quote-concepts/${idQuote}/`, concept)
  }

  // Get Concepts Quotation
  getConceptQuotes(filter: LiftingPaginate): Observable<ModelQuotationConcept> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.quote_id ? params = params.append('quote_id', filter.quote_id) : null;
    return this.http.get<ModelQuotationConcept>(`${this.baseUrl}/quote-concepts/`, {params})
  }

  // Get Concept
  getConceptQuoteById(id: number | undefined) : Observable<QuotationConceptDetail> {
    return this.http.get<QuotationConceptDetail>(`${this.baseUrl}/quote-concepts/${id}`)
  }

  // Delete Concept
  deleteConcept(id: number | undefined) : Observable<QuotationConceptDetail> {
    return this.http.delete<QuotationConceptDetail>(`${this.baseUrl}/quote-concepts/${id}`)
  }

  // Delete Contact
  deleteQuote(id: number) : Observable<QuotationConceptDetail>{
    return this.http.delete<QuotationConceptDetail>(`${this.baseUrl}/quotes/${id}`)
  }

  // Delete Contact
  deleteLifting(id: number) : Observable<liftingDetail>{
    return this.http.delete<liftingDetail>(`${this.baseUrl}/liftings/${id}`)
  }

  updateStatus(idQuote : number, form: FormGroup) : Observable<QuotationConceptDetail> {
    return this.http.put<QuotationConceptDetail>(`${this.baseUrl}/quotes-status/${idQuote}/`, form)
  }

  // send email door By Task
  sendEmail(email: EmailSend) : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/quotes-pdf-send-email/`, email)
  }

  updateDate(idQuote : number, data: any) : Observable<QuotationConceptDetail> {
    return this.http.put<QuotationConceptDetail>(`${this.baseUrl}/quotes-data/${idQuote}/`, data)
  }

}
