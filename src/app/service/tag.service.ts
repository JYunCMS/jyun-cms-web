import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResponseService } from '../common/response.service';
import { Observable } from 'rxjs';
import { Tag } from '../domain/tag';
import { BackEndApi } from '../back-end-api';
import { catchError } from 'rxjs/operators';
import { ArticleTag } from '../domain/article-tag';

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
    return this.http.get<Tag[]>(BackEndApi.tags)
      .pipe(catchError(this.responseService.handleError<Tag[]>('tagService.getTags()', null)));
  }

  addNewTag(tag: Tag): Observable<Tag[]> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Tag[]>(BackEndApi.tags, tag, headers)
      .pipe(catchError(this.responseService.handleError<Tag[]>('tagService.addNewTag()', null)));
  }

  updateTag(tag: Tag): Observable<Tag> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Tag>(BackEndApi.tags, tag, headers)
      .pipe(catchError(this.responseService.handleError<Tag>('tagService.updateTag()', null)));
  }

  deleteTag(name: string): Observable<Tag[]> {
    const params = new HttpParams()
      .append('name', name);
    return this.http.delete<Tag[]>(BackEndApi.tags + '?' + params)
      .pipe(catchError(this.responseService.handleError<Tag[]>('tagService.deleteTag()', null)));
  }

  addArticleBind(articleTag: ArticleTag): Observable<ArticleTag> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<ArticleTag>(BackEndApi.tagsArticleBind, articleTag, headers)
      .pipe(catchError(this.responseService.handleError<ArticleTag>('tagService.addArticleBind()', null)));
  }
}
