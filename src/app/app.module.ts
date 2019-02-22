import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticleAllComponent } from './article-all/article-all.component';
import { ArticleNewComponent } from './article-new/article-new.component';
import { NavigationCategoryComponent } from './navigation-category/navigation-category.component';
import { NavigationTagComponent } from './navigation-tag/navigation-tag.component';
import { ResourceAllComponent } from './resource-all/resource-all.component';
import { ResourceUploadComponent } from './resource-upload/resource-upload.component';
import { UserAllComponent } from './user-all/user-all.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserMeComponent } from './user-me/user-me.component';
import { SettingCommonComponent } from './setting-common/setting-common.component';
import { SettingEditComponent } from './setting-edit/setting-edit.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ArticleAllComponent,
    ArticleNewComponent,
    NavigationCategoryComponent,
    NavigationTagComponent,
    ResourceAllComponent,
    ResourceUploadComponent,
    UserAllComponent,
    UserCreateComponent,
    UserMeComponent,
    SettingCommonComponent,
    SettingEditComponent
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [{provide: NZ_I18N, useValue: zh_CN}],
  bootstrap: [AppComponent]
})

export class AppModule {
}
