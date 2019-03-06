import { Injectable } from '@angular/core';
import { Category } from '../domain/category';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BackEndApi } from '../back-end-api';
import { catchError } from 'rxjs/operators';
import { ResponseService } from '../common/response.service';

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
      .pipe(catchError(this.responseService.handleError<Category[]>('categoryService.getNodes()', null)));
  }

  addNode(category: Category): Observable<Category[]> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Category[]>(BackEndApi.categories, category, headers)
      .pipe(catchError(this.responseService.handleError<Category[]>('categoryService.addNode()', null)));
  }

  updateNode(category: Category): Observable<Category[]> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Category[]>(BackEndApi.categories, category, headers)
      .pipe(catchError(this.responseService.handleError<Category[]>('categoryService.updateNode()', null)));
  }

  deleteNode(urlAlias: string): Observable<Category[]> {
    const params = new HttpParams()
      .append('urlAlias', urlAlias);
    return this.http.delete<Category[]>(BackEndApi.categories + '?' + params)
      .pipe(catchError(this.responseService.handleError<Category[]>('categoryService.deleteNode()', null)));
  }

  getCategory(urlAlias: string): Observable<Category> {
    const params = new HttpParams()
      .append('urlAlias', urlAlias);
    return this.http.get<Category>(BackEndApi.categoriesCategory + params)
      .pipe(catchError(this.responseService.handleError<Category>('categoryService.getNodeById()', null)));
  }

  getCount(nodeLevel: number, parentUrlAlias: string): Observable<number> {
    const params = new HttpParams()
      .append('nodeLevel', nodeLevel.toString())
      .append('parentUrlAlias', parentUrlAlias);
    return this.http.get<number>(BackEndApi.categoriesCount + params)
      .pipe(catchError(this.responseService.handleError<number>('categoryService.getCountByLevelAndParentUrlAlias()', null)));
  }

  moveUpNode(urlAlias: string): Observable<Category[]> {
    const params = new HttpParams()
      .append('urlAlias', urlAlias);
    return this.http.patch<Category[]>(BackEndApi.categoriesMoveUpNode + params, null)
      .pipe(catchError(this.responseService.handleError<Category[]>('categoryService.moveUpNode()', null)));
  }

  moveDownNode(urlAlias: string): Observable<Category[]> {
    const params = new HttpParams()
      .append('urlAlias', urlAlias);
    return this.http.patch<Category[]>(BackEndApi.categoriesMoveDownNode + params, null)
      .pipe(catchError(this.responseService.handleError<Category[]>('categoryService.moveDownNode()', null)));
  }
}
