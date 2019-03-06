import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseService } from '../common/response.service';
import { Observable } from 'rxjs';
import { Article } from '../domain/article';
import { BackEndApi } from '../back-end-api';
import { catchError } from 'rxjs/operators';

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
      .pipe(catchError(this.responseService.handleError<Article>('articleService.getArticles()', null)));
  }
}
