import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ArticleAllComponent } from "./article-all/article-all.component";
import { ArticleNewComponent } from "./article-new/article-new.component";
import { NavigationCategoryComponent } from "./navigation-category/navigation-category.component";
import { NavigationTagComponent } from "./navigation-tag/navigation-tag.component";
import { ResourceAllComponent } from "./resource-all/resource-all.component";
import { ResourceUploadComponent } from "./resource-upload/resource-upload.component";
import { UserAllComponent } from "./user-all/user-all.component";
import { UserCreateComponent } from "./user-create/user-create.component";
import { UserMeComponent } from "./user-me/user-me.component";
import { SettingCommonComponent } from "./setting-common/setting-common.component";
import { SettingEditComponent } from "./setting-edit/setting-edit.component";

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'article/all', component: ArticleAllComponent},
  {path: 'article/new', component: ArticleNewComponent},
  {path: 'navigation/category', component: NavigationCategoryComponent},
  {path: 'navigation/tag', component: NavigationTagComponent},
  {path: 'resource/all', component: ResourceAllComponent},
  {path: 'resource/upload', component: ResourceUploadComponent},
  {path: 'user/all', component: UserAllComponent},
  {path: 'user/create', component: UserCreateComponent},
  {path: 'user/me', component: UserMeComponent},
  {path: 'setting/common', component: SettingCommonComponent},
  {path: 'setting/edit', component: SettingEditComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
