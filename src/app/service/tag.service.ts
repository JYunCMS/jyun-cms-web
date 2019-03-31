import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResponseService } from '../util/response.service';
import { Observable } from 'rxjs';
import { Tag } from '../domain/tag';
import { BackEndApi } from '../config/back-end-api';
import { catchError } from 'rxjs/operators';
import { LocalStorageKey } from '../config/local-storage-key';

@Injectable({
  providedIn: 'root'
})

export class TagService {

  constructor(
    private http: HttpClient,
    private responseService: ResponseService
  ) {
  }

  getTags(): Observable<Tag[]> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.get<Tag[]>(BackEndApi.tags, headers)
      .pipe(catchError(this.responseService.handleError<Tag[]>('tagService.getTags()', null)));
  }

  addNewTag(tag: Tag): Observable<Tag[]> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.post<Tag[]>(BackEndApi.tags, tag, headers)
      .pipe(catchError(this.responseService.handleError<Tag[]>('tagService.addNewTag()', null)));
  }

  deleteTag(name: string): Observable<Tag[]> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    const params = new HttpParams()
      .append('name', name);
    return this.http.delete<Tag[]>(BackEndApi.tags + '?' + params, headers)
      .pipe(catchError(this.responseService.handleError<Tag[]>('tagService.deleteTag()', null)));
  }
}
