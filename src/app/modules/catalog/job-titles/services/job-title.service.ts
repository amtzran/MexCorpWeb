import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {JobTitle, JobTitlePaginate, ModelJobTitle} from "../models/job-title.interface";

@Injectable({
  providedIn: 'root'
})
export class JobTitleService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Job Title
  getJobTitleById(id: number) : Observable<JobTitle> {
    return this.http.get<JobTitle>(`${this.baseUrl}/jobs/${id}`)
  }

  // Get Job Titles
  getJobTitles(filter: JobTitlePaginate): Observable<ModelJobTitle> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelJobTitle>(`${this.baseUrl}/jobs/`, {params})
  }

  // Add Job Title
  addJobTitle(jobTitle: JobTitle): Observable<JobTitle> {
    return this.http.post<JobTitle>(`${this.baseUrl}/jobs/`, jobTitle)
  }

  // Update Job Title
  updateJobTitle(idJobTitle: number, jobTitle: JobTitle) : Observable<JobTitle> {
    return this.http.put<JobTitle>(`${this.baseUrl}/jobs/${idJobTitle}/`,jobTitle)
  }

  // Delete Job Title
  deleteJobTitle(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/jobs/${id}`)
  }

}
