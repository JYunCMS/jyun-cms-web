import { Component, OnInit } from '@angular/core';
import { SiderMenuService } from '../../util/sider-menu.service';
import { AppComponent } from '../app.component';
import { User } from '../../domain/user';
import { LocalStorageKey } from '../../config/local-storage-key';
import { UserRole } from '../../config/user-role';
import { UserService } from '../../service/user.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UpdatePasswordInfo } from '../../domain/request/update-password-info';

@Component({
  selector: 'app-user-me',
  templateUrl: './user-me.component.html',
  styleUrls: ['./user-me.component.css']
})

export class UserMeComponent implements OnInit {

  oldPassword: string = null;
  newPassword: string = null;
  newPasswordAgain: string = null;
  user: User = JSON.parse(localStorage.getItem(LocalStorageKey.currentLoginUser));
  roleList = UserRole.roleList;

  isLoadingUpdateSelfInfo = false;
  isLoadingUpdateSelfPassword = false;
  inUpdateSelfInfoPage = true;

  constructor(
    private siderMenuService: SiderMenuService,
    private userService: UserService,
    private nzMsgService: NzMessageService,
    private modalService: NzModalService
  ) {
  }

  ngOnInit() {
    this.siderMenuService.initLeftSiderStatus('user', 'me', AppComponent.self.openMap, AppComponent.self.selectMap);
  }

  updateSelfInfo() {
    this.isLoadingUpdateSelfInfo = true;
    this.userService.updateSelfInfo(this.user)
      .subscribe(result => {
        if (result != null) {
          this.nzMsgService.success('个人资料更新成功！');
          this.modalService.confirm({
            nzTitle: '<i><b>重新登录？</b></i>',
            nzContent: '用户 <strong>' + this.user.username + '</strong> 资料变更将在重新登录后生效<br/><br/><b>去重新登录？</b>',
            nzOnOk: () => {
              AppComponent.self.logout();
            }
          });
        }
        this.isLoadingUpdateSelfInfo = false;
      });
  }

  updateSelfPassword() {
    if (this.oldPassword == null || this.oldPassword === ''
      || this.newPassword == null || this.newPassword === ''
      || this.newPasswordAgain == null || this.newPasswordAgain === '') {
      this.nzMsgService.warning('发现未填项！');
      return;
    }
    if (this.newPassword !== this.newPasswordAgain) {
      this.nzMsgService.warning('新密码两次输入不一致！');
      return;
    }
    this.userService.updateSelfPassword(
      new UpdatePasswordInfo(
        this.oldPassword,
        new User(localStorage.getItem(LocalStorageKey.currentLoginUsername), this.newPassword, null, null)))
      .subscribe(result => {
        if (result != null) {
          this.nzMsgService.success('密码更新成功，请重新登录！');
          AppComponent.self.logout();
        }
      });
  }
}
