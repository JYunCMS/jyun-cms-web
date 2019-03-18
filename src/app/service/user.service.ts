import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseService } from '../util/response.service';
import { Observable } from 'rxjs';
import { User } from '../domain/user';
import { BackEndApi } from '../config/back-end-api';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private responseService: ResponseService
  ) {
  }

  getUserList(userToken: string, username: string): Observable<User[]> {

    const headers = {
      headers: new HttpHeaders({
        Authorization: userToken,
        From: username
      })
    };
    return this.http.get<User[]>(BackEndApi.users, headers)
      .pipe(catchError(this.responseService.handleError<User[]>('userService.getUserList()', null)));
  }
}
