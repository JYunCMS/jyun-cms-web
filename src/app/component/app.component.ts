import { Component, OnInit } from '@angular/core';
import { SiderMenuService } from '../util/sider-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageKey } from '../config/local-storage-key';
import { User } from '../domain/user';
import { Observable, of } from 'rxjs';
import { LoginUserInfo } from '../domain/response/login-user-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackEndApi } from '../config/back-end-api';
import { catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public static self;

  loginStatus: boolean;
  currentLoginUser: User;
  username = '';
  password = '';

  errorMessage: string;
  warningMessage: string;

  isCollapsed = false;
  isLoadingLogin = false;

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
    private siderMenuService: SiderMenuService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private nzMsgService: NzMessageService
  ) {
  }

  ngOnInit(): void {
    AppComponent.self = this;
    this.initLoginStatus();
  }

  initLoginStatus() {
    this.loginStatus = !(localStorage.getItem(LocalStorageKey.currentLoginUserToken) == null
      || localStorage.getItem(LocalStorageKey.currentLoginUser) == null
      || localStorage.getItem(LocalStorageKey.currentLoginUsername) == null);
    if (this.loginStatus) {
      this.currentLoginUser = JSON.parse(localStorage.getItem(LocalStorageKey.currentLoginUser));
    } else {
      this.router.navigate(['']);
    }
  }

  openHandler(value: string): void {
    this.siderMenuService.openSiderMenuHandler(value, this.openMap);
  }

  login() {
    if (this.username !== '' && this.password !== '') {
      this.isLoadingLogin = true;
      this.loginRequest(new User(this.username, this.password, null, null))
        .subscribe(loginUserInfo => {
          if (loginUserInfo != null) {
            if (loginUserInfo.status) {
              // 登录成功
              this.nzMsgService.success('登录成功！');
              this.currentLoginUser = loginUserInfo.user;

              localStorage.setItem(LocalStorageKey.currentLoginUserToken, loginUserInfo.token);
              localStorage.setItem(LocalStorageKey.currentLoginUser, JSON.stringify(loginUserInfo.user));
              localStorage.setItem(LocalStorageKey.currentLoginUsername, loginUserInfo.user.username);

              this.router.navigate(['dashboard']);
              this.loginStatus = true;

              this.username = '';
              this.password = '';
            } else {
              // 登录失败
              this.nzMsgService.error('用户名或密码错误！');
            }
          }
          this.isLoadingLogin = false;
        });
    }
  }

  private loginRequest(user: User): Observable<LoginUserInfo> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<LoginUserInfo>(BackEndApi.usersLogin, user, headers)
      .pipe(catchError(this.loginRequestErrorHandler<LoginUserInfo>('appComponent.login()', null)));
  }

  private loginRequestErrorHandler<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // 将错误信息打印到控制台
      console.log(`The error comes from: ${operation}`);
      console.log(error);

      // 应用界面为用户弹出错误提示
      this.errorMessage = `${error.error.message}`;

      // 通过返回空结果让应用程序继续运行
      return of(result as T);
    };
  }

  logout() {
    localStorage.removeItem(LocalStorageKey.currentLoginUserToken);
    localStorage.removeItem(LocalStorageKey.currentLoginUser);
    localStorage.removeItem(LocalStorageKey.currentLoginUsername);

    this.router.navigate(['']);
    this.loginStatus = false;
  }
}
