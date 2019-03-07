import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../common/util.service';
import { AppComponent } from '../app.component';
import { Article } from '../../domain/article';
import { ArticleService } from '../../service/article.service';

@Component({
  selector: 'app-article-all',
  templateUrl: './article-all.component.html',
  styleUrls: ['./article-all.component.css']
})

export class ArticleAllComponent implements OnInit {

  scope: string; // 文章显示范围（全部、已发布……）
  date: number; // 文章时间筛选条件
  category: string; // 文章分类筛选条件
  tag: string; // 文章标签筛选条件

  articleList: Article[] = [];

  constructor(
    private utilService: UtilService,
    private articleService: ArticleService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('article', 'all', AppComponent.self.openMap, AppComponent.self.selectMap);
    this.articleService.getArticles()
      .subscribe(result => this.articleList = result);
  }
}
