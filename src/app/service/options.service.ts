import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseService } from '../util/response.service';
import { Observable } from 'rxjs';
import { Options } from '../domain/options';
import { LocalStorageKey } from '../config/local-storage-key';
import { BackEndApi } from '../config/back-end-api';
import { catchError } from 'rxjs/operators';
import { HomeCarouselImages } from '../domain/options/home-carousel-images';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor(
    private http: HttpClient,
    private responseService: ResponseService
  ) {
  }

  getOptions(): Observable<Options[]> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.get<Options[]>(BackEndApi.options, headers)
      .pipe(catchError(this.responseService.handleError<Options[]>('optionsService.getOptions()', null)));
  }

  setHomeCarouselImages(homeCarouselImagesList: HomeCarouselImages[]): Observable<HomeCarouselImages[]> {
    const headers = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.post<HomeCarouselImages[]>(BackEndApi.optionsHomeCarouselImages, homeCarouselImagesList, headers)
      .pipe(catchError(this.responseService.handleError<HomeCarouselImages[]>('optionsService.setHomeCarouselImages()', null)));
  }
}
