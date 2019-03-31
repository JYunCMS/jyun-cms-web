import { Component, OnInit } from '@angular/core';
import { LocalStorageKey } from '../../config/local-storage-key';
import { Router } from '@angular/router';
import { HelloService } from '../../service/hello.service';
import { InitSystemInfo } from '../../domain/request/init-system-info';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showInitSystemView = false;
  adminPassword: string = null;

  constructor(
    private router: Router,
    private helloService: HelloService,
    private nzMsgService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.initLoginStatus();
    this.judgeAlreadyInitSystem();
  }

  private initLoginStatus() {
    if (!(localStorage.getItem(LocalStorageKey.currentLoginUserToken) == null
      || localStorage.getItem(LocalStorageKey.currentLoginUser) == null
      || localStorage.getItem(LocalStorageKey.currentLoginUsername) == null)) {
      this.router.navigate(['dashboard']);
    }
  }

  private judgeAlreadyInitSystem() {
    // 本地缓存数据判断
    const alreadyInitSystem = localStorage.getItem(LocalStorageKey.alreadyInitSystem);
    if (alreadyInitSystem != null && alreadyInitSystem === 'true') {
      // 系统已经初始化
      return;
    }

    // 服务器获取数据判断
    this.helloService.alreadyInitSystem()
      .subscribe(result => {
        if (result) {
          localStorage.setItem(LocalStorageKey.alreadyInitSystem, 'true');
        } else {
          this.showInitSystemView = true;
        }
      });
  }

  initSystem() {
    if (this.adminPassword == null || this.adminPassword === '') {
      this.nzMsgService.warning('密码不能为空');
      return;
    }
    this.helloService.initSystem(new InitSystemInfo(this.adminPassword))
      .subscribe(loginUserInfo => {
        if (loginUserInfo != null) {
          if (loginUserInfo.status === true) {
            this.nzMsgService.success(loginUserInfo.message);
            this.showInitSystemView = false;
            localStorage.setItem(LocalStorageKey.alreadyInitSystem, 'true');
          } else {
            this.nzMsgService.warning(loginUserInfo.message);
          }
        }
      });
  }
}
