import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {GroupDetail, GroupFilterModel, GroupModel} from "../models/group.interface";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {
  }

  private baseUrl: string = environment.baseUrl;

  /**
   * get all groups from the database by means of rest api.
   * @param filter
   */
  getGroups(filter: GroupFilterModel): Observable<GroupModel> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<GroupModel>(`${this.baseUrl}/groups/`, {params});
  }

  /**
   * Get retrieve a group from the database by means of rest api.
   * @param idGroup
   */
  getGroupById(idGroup: number): Observable<GroupDetail> {
    return this.http.get<GroupDetail>(`${ this.baseUrl }/groups/${idGroup}/`);
  }

  /**
   * Create a group.
   * @param group
   */
  postGroup(group: FormData): Observable<GroupDetail>{
    return this.http.post<GroupDetail>(`${ this.baseUrl }/groups/`, group);
  }

  /**
   * Update a group.
   * @param groupId
   * @param group
   */
  updateGroup(groupId: number, group: FormData){
    return this.http.post(`${ this.baseUrl }/groups/${groupId}/`, group);
  }

  /**
   * Delete a group.
   * @param idGroup
   */
  deleteGroup(idGroup: number): Observable<any>{
    return this.http.delete<any>(`${ this.baseUrl }/groups/${idGroup}/`);
  }

}
