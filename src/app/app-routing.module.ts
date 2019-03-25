import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ArticleAllComponent } from './component/article-all/article-all.component';
import { ArticleNewComponent } from './component/article-new/article-new.component';
import { ArticleResourceComponent } from './component/article-resource/article-resource.component';
import { NavigationCategoryComponent } from './component/navigation-category/navigation-category.component';
import { NavigationTagComponent } from './component/navigation-tag/navigation-tag.component';
import { UserAllComponent } from './component/user-all/user-all.component';
import { UserCreateComponent } from './component/user-create/user-create.component';
import { UserMeComponent } from './component/user-me/user-me.component';
import { SettingCommonComponent } from './component/setting-common/setting-common.component';
import { SettingHomeComponent } from './component/setting-home/setting-home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'article/all', component: ArticleAllComponent},
  {path: 'article/new', component: ArticleNewComponent},
  {path: 'article/resource', component: ArticleResourceComponent},
  {path: 'navigation/category', component: NavigationCategoryComponent},
  {path: 'navigation/tag', component: NavigationTagComponent},
  {path: 'user/all', component: UserAllComponent},
  {path: 'user/create', component: UserCreateComponent},
  {path: 'user/me', component: UserMeComponent},
  {path: 'setting/common', component: SettingCommonComponent},
  {path: 'setting/home', component: SettingHomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
