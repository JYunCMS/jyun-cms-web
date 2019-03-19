import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResponseService } from '../util/response.service';
import { Observable } from 'rxjs';
import { Resource } from '../domain/resource';
import { BackEndApi } from '../config/back-end-api';
import { catchError } from 'rxjs/operators';
import { ResourceFilterConditions } from '../domain/response/resource-filter-conditions';
import { LocalStorageKey } from '../config/local-storage-key';

@Injectable({
  providedIn: 'root'
})

export class ResourceService {

  constructor(
    private http: HttpClient,
    private responseService: ResponseService
  ) {
  }

  getResources(): Observable<Resource[]> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.get<Resource[]>(BackEndApi.resources, headers)
      .pipe(catchError(this.responseService.handleError<Resource[]>('resourceService.getResources()', null)));
  }

  deleteResource(location: string): Observable<Resource[]> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    const params = new HttpParams()
      .append('location', location);
    return this.http.delete<Resource[]>(BackEndApi.resources + '?' + params, headers)
      .pipe(catchError(this.responseService.handleError<Resource[]>('resourceService.deleteResource()', null)));
  }

  getFilterConditions(): Observable<ResourceFilterConditions> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.get<ResourceFilterConditions>(BackEndApi.resourcesFilterConditions, headers)
      .pipe(catchError(this.responseService.handleError<ResourceFilterConditions>('resourceService.getTypes()', null)));
  }

  getByConditions(date: string, type: string): Observable<Resource[]> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    const params = new HttpParams()
      .append('date', date)
      .append('type', type);
    return this.http.get<Resource[]>(BackEndApi.resourcesByConditions + '?' + params, headers)
      .pipe(catchError(this.responseService.handleError<Resource[]>('resourceService.getByConditions()', null)));
  }
}
