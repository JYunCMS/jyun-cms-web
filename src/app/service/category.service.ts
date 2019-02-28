import { Injectable } from '@angular/core';
import { Category } from "../domain/category";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BackEndApi } from "../back-end-api";
import { catchError } from "rxjs/operators";
import { ResponseService } from "./response.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
    private responseService: ResponseService
  ) {
  }

  getNodes(): Observable<Category[]> {
    return this.http.get<Category[]>(BackEndApi.categories)
      .pipe(catchError(this.responseService.handleError<Category[]>('getNodes', null)));
  }

  addNode(category: Category): Observable<Category[]> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Category[]>(BackEndApi.categories, category, headers)
      .pipe(catchError(this.responseService.handleError<Category[]>('addNode', null)));
  }

  updateNode(category: Category): Observable<Category[]> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Category[]>(BackEndApi.categories, category, headers)
      .pipe(catchError(this.responseService.handleError<Category[]>('updateNode', null)));
  }

  deleteNode(urlAlias: string): Observable<void> {
    const params = new HttpParams()
      .append('urlAlias', urlAlias);
    return this.http.delete<void>(BackEndApi.categories + '?' + params)
      .pipe(catchError(this.responseService.handleError<void>('deleteNode', null)));
  }

  getCategoryById(urlAlias: string): Observable<Category> {
    const params = new HttpParams()
      .append('urlAlias', urlAlias);
    return this.http.get<Category>(BackEndApi.categoriesCategoryById + params)
      .pipe(catchError(this.responseService.handleError<Category>('getNodeById', null)));
  }

  getCountByLevelAndParentUrlAlias(nodeLevel: number, parentUrlAlias: string): Observable<number> {
    const params = new HttpParams()
      .append('nodeLevel', nodeLevel.toString())
      .append('parentUrlAlias', parentUrlAlias);
    return this.http.get<number>(BackEndApi.categoriesCountByLevelAndParentUrlAlias + params)
      .pipe(catchError(this.responseService.handleError<number>('getCountByLevelAndParentUrlAlias', null)));
  }

  moveUpNode(urlAlias: string): Observable<Category[]> {
    const params = new HttpParams()
      .append('urlAlias', urlAlias);
    return this.http.patch<Category[]>(BackEndApi.categoriesMoveUpNode + params, null)
      .pipe(catchError(this.responseService.handleError<Category[]>('moveUpNode', null)));
  }

  moveDownNode(urlAlias: string): Observable<Category[]> {
    const params = new HttpParams()
      .append('urlAlias', urlAlias);
    return this.http.patch<Category[]>(BackEndApi.categoriesMoveDownNode + params, null)
      .pipe(catchError(this.responseService.handleError<Category[]>('moveDownNode', null)));
  }
}
