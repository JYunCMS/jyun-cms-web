import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResponseService } from '../util/response.service';
import { Observable } from 'rxjs';
import { User } from '../domain/user';
import { BackEndApi } from '../config/back-end-api';
import { catchError } from 'rxjs/operators';
import { LocalStorageKey } from '../config/local-storage-key';
import { UpdateUserInfo } from '../domain/request/update-user-info';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private responseService: ResponseService
  ) {
  }

  getUserList(): Observable<User[]> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.get<User[]>(BackEndApi.users, headers)
      .pipe(catchError(this.responseService.handleError<User[]>('userService.getUserList()', null)));
  }

  addNewUser(user: User): Observable<User> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.post<User>(BackEndApi.users, user, headers)
      .pipe(catchError(this.responseService.handleError<User>('userService.addNewUser()', null)));
  }

  updateUser(updateUserInfo: UpdateUserInfo): Observable<User> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.put<User>(BackEndApi.users, updateUserInfo, headers)
      .pipe(catchError(this.responseService.handleError<User>('userService.updateUser', null)));
  }

  deleteUser(username: string): Observable<void> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    const params = new HttpParams()
      .append('username', username);
    return this.http.delete<void>(BackEndApi.users + '?' + params, headers)
      .pipe(catchError(this.responseService.handleError<void>('userService.deleteUser()', null)));
  }
}
