import { Component, OnInit } from '@angular/core';
import { UtilService } from "../util.service";
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-article-new',
  templateUrl: './article-new.component.html',
  styleUrls: ['./article-new.component.css']
})

export class ArticleNewComponent implements OnInit {

  constructor(
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('article', 'new', AppComponent.self.openMap, AppComponent.self.selectMap);
  }
}
