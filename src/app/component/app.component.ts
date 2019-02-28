import { Component, OnInit } from '@angular/core';
import { UtilService } from "../service/util.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public static self;

  errorMessage: string;
  warningMessage: string;

  isCollapsed = false;

  openMap = {
    article: false,
    navigation: false,
    resource: false,
    user: false,
    setting: false
  };

  selectMap = {
    dashboard: false,
    article_all: false,
    article_new: false,
    navigation_category: false,
    navigation_tag: false,
    resource_all: false,
    resource_upload: false,
    user_all: false,
    user_create: false,
    user_me: false,
    setting_common: false,
    setting_edit: false
  };

  constructor(
    private utilService: UtilService
  ) {
  }

  ngOnInit(): void {
    AppComponent.self = this;
  }

  openHandler(value: string): void {
    this.utilService.openHandler(value, this.openMap);
  }
}
