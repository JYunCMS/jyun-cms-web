import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseService } from '../util/response.service';
import { Observable } from 'rxjs';
import { BackEndApi } from '../config/back-end-api';
import { catchError } from 'rxjs/operators';
import { InitSystemInfo } from '../domain/request/init-system-info';
import { LoginUserInfo } from '../domain/response/login-user-info';

@Injectable({
  providedIn: 'root'
})
export class HelloService {

  constructor(
    private http: HttpClient,
    private responseService: ResponseService
  ) {
  }

  alreadyInitSystem(): Observable<boolean> {
    return this.http.get<boolean>(BackEndApi.hello)
      .pipe(catchError(this.responseService.handleError<boolean>('helloService.alreadyInitSystem()', null)));
  }

  initSystem(initSystemInfo: InitSystemInfo): Observable<LoginUserInfo> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<LoginUserInfo>(BackEndApi.hello, initSystemInfo, headers)
      .pipe(catchError(this.responseService.handleError<LoginUserInfo>('helloService.initSystem()', null)));
  }
}
