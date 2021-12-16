import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Group, GroupFilterModel, GroupModel} from "../models/group.interface";

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
    return this.http.get<GroupModel>(`${this.baseUrl}/job-centers/`, {params});
  }

  /**
   * Get retrieve a group from the database by means of rest api.
   * @param idGroup
   */
  getGroupById(idGroup: number): Observable<Group> {
    return this.http.get<Group>(`${ this.baseUrl }/job-centers/${idGroup}/`);
  }

  /**
   * Create a group.
   * @param group
   */
  postGroup(group: Group): Observable<Group>{
    return this.http.post<Group>(`${ this.baseUrl }/job-centers/`, group);
  }

  /**
   * Update a group.
   * @param groupId
   * @param group
   */
  updateGroup(groupId: number, group: Group){
    return this.http.patch(`${ this.baseUrl }/job-centers/${groupId}/`, group);
  }

  /**
   * Delete a group.
   * @param idGroup
   */
  deleteGroup(idGroup: number): Observable<any>{
    return this.http.delete<any>(`${ this.baseUrl }/job-centers/${idGroup}/`);
  }

}
