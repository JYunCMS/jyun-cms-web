import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseService } from '../util/response.service';
import { Observable } from 'rxjs';
import { Options } from '../domain/options';
import { LocalStorageKey } from '../config/local-storage-key';
import { BackEndApi } from '../config/back-end-api';
import { catchError } from 'rxjs/operators';
import { HomeCarouselImages } from '../domain/options/home-carousel-images';
import { FriendlyLinks } from '../domain/options/friendly-links';
import { SiteTitle } from '../domain/options/site-title';
import { CopyrightInfo } from '../domain/options/copyright-info';
import { WebsiteFilingInfo } from '../domain/options/website-filing-info';

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

  setSiteTitle(siteTitle: SiteTitle): Observable<SiteTitle> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.post<SiteTitle>(BackEndApi.optionsSiteTitle, siteTitle, headers)
      .pipe(catchError(this.responseService.handleError<SiteTitle>('optionsService.setSiteTitle()', null)));
  }

  setCopyrightInfo(copyrightInfo: CopyrightInfo): Observable<CopyrightInfo> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.post<CopyrightInfo>(BackEndApi.optionsCopyrightInfo, copyrightInfo, headers)
      .pipe(catchError(this.responseService.handleError<CopyrightInfo>('optionsService.setCopyrightInfo()', null)));
  }

  setWebsiteFilingInfo(websiteFilingInfo: WebsiteFilingInfo): Observable<WebsiteFilingInfo> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.post<WebsiteFilingInfo>(BackEndApi.optionsWebsiteFilingInfo, websiteFilingInfo, headers)
      .pipe(catchError(this.responseService.handleError<WebsiteFilingInfo>('optionsService.setWebsiteFilingInfo()', null)));
  }

  setHomeCarouselImages(homeCarouselImagesList: HomeCarouselImages[]): Observable<HomeCarouselImages[]> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.post<HomeCarouselImages[]>(BackEndApi.optionsHomeCarouselImages, homeCarouselImagesList, headers)
      .pipe(catchError(this.responseService.handleError<HomeCarouselImages[]>('optionsService.setHomeCarouselImages()', null)));
  }

  setFriendlyLinks(friendlyLinks: FriendlyLinks[]): Observable<FriendlyLinks[]> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(LocalStorageKey.currentLoginUserToken),
        From: localStorage.getItem(LocalStorageKey.currentLoginUsername)
      })
    };
    return this.http.post<FriendlyLinks[]>(BackEndApi.optionsFriendlyLinks, friendlyLinks, headers)
      .pipe(catchError(this.responseService.handleError<FriendlyLinks[]>('optionsService.setFriendlyLinks()')));
  }
}
