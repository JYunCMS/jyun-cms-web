import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResponseService } from '../util/response.service';
import { Observable } from 'rxjs';
import { Article } from '../domain/article';
import { BackEndApi } from '../config/back-end-api';
import { catchError } from 'rxjs/operators';
import { ArticleFilterConditions } from '../domain/response/article-filter-conditions';

@Injectable({
  providedIn: 'root'
})

export class ArticleService {

  constructor(
    private http: HttpClient,
    private responseService: ResponseService
  ) {
  }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(BackEndApi.articles)
      .pipe(catchError(this.responseService.handleError<Article[]>('articleService.getArticles()', null)));
  }

  newArticle(article: Article): Observable<Article> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Article>(BackEndApi.articles, article, headers)
      .pipe(catchError(this.responseService.handleError<Article>('articleService.newArticle()', null)));
  }

  updateArticle(article: Article): Observable<Article> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Article>(BackEndApi.articles, article, headers)
      .pipe(catchError(this.responseService.handleError<Article>('articleService.updateArticle', null)));
  }

  deleteArticle(articleId: number): Observable<Article> {
    const params = new HttpParams()
      .append('articleId', articleId.toString());
    return this.http.delete<Article>(BackEndApi.articles + '?' + params)
      .pipe(catchError(this.responseService.handleError<Article>('articleService.deleteArticle', null)));
  }

  getFilterConditions(): Observable<ArticleFilterConditions> {
    return this.http.get<ArticleFilterConditions>(BackEndApi.articlesFilterConditions)
      .pipe(catchError(this.responseService.handleError<ArticleFilterConditions>('articleService.getFilterConditions()', null)));
  }

  getArticlesByStatus(status: string): Observable<Article[]> {
    const params = new HttpParams()
      .append('status', status);
    return this.http.get<Article[]>(BackEndApi.articlesByStatus + '?' + params)
      .pipe(catchError(this.responseService.handleError<Article[]>('articleService.getArticlesByStatus()', null)));
  }

  getArticlesByConditions(status: string,
                          selectedDate: string,
                          selectedCategory: string,
                          selectedTag: string): Observable<Article[]> {
    const params = new HttpParams()
      .append('status', status)
      .append('selectedDate', selectedDate)
      .append('selectedCategory', selectedCategory)
      .append('selectedTag', selectedTag);
    return this.http.get<Article[]>(BackEndApi.articlesByConditions + '?' + params)
      .pipe(catchError(this.responseService.handleError<Article[]>('articleService.getArticlesByConditions()', null)));
  }

  moveToRecycleBin(beDelete: boolean, article: Article): Observable<Article> {
    const params = new HttpParams()
      .append('beDelete', beDelete ? 'true' : 'false');
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Article>(BackEndApi.articlesMoveToRecycleBin + '?' + params, article, headers)
      .pipe(catchError(this.responseService.handleError<Article>('articleService.movoToRecycleBin()', null)));
  }
}
