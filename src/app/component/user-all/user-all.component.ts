import { Component, OnInit } from '@angular/core';
import { SiderMenuService } from '../../util/sider-menu.service';
import { AppComponent } from '../app.component';
import { UserService } from '../../service/user.service';
import { User } from '../../domain/user';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UserRole } from '../../config/user-role';
import { LocalStorageKey } from '../../config/local-storage-key';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-all',
  templateUrl: './user-all.component.html',
  styleUrls: ['./user-all.component.css']
})

export class UserAllComponent implements OnInit {

  roleList: string[] = UserRole.roleList;

  userList: User[] = [];
  operatingUser: User = new User(null, null, null, null);

  updateUserVisible = false;
  isLoadingUpdateUser = false;

  constructor(
    private siderMenuService: SiderMenuService,
    private userService: UserService,
    private modalService: NzModalService,
    private router: Router,
    private nzMsgService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.siderMenuService.initLeftSiderStatus('user', 'all', AppComponent.self.openMap, AppComponent.self.selectMap);
    this.initUserList();
  }

  private initUserList() {
    this.userService.getUserList()
      .subscribe(result => this.userList = result);
  }

  updateUser() {
    this.isLoadingUpdateUser = true;
    this.userService.updateUser(this.operatingUser)
      .subscribe(result => {
        this.userList = result;
        this.isLoadingUpdateUser = false;
        this.updateUserVisible = false;
      });
  }

  updateUserShow(user: User) {
    if (user.username === localStorage.getItem(LocalStorageKey.currentLoginUsername)) {
      this.router.navigate(['user', 'me']);
    }
    this.updateUserVisible = true;
    this.operatingUser = new User(user.username, user.password, user.nickname, user.role);
  }

  updateUserClose() {
    this.modalService.confirm({
      nzTitle: '<i><b>离开编辑页面？</b></i>',
      nzContent: '修改的内容将不被保存<br/><br/><b>确认继续吗？</b>',
      nzOnOk: () => {
        this.updateUserVisible = false;
      }
    });
  }

  deleteUser(user: User) {
    if (user.username === localStorage.getItem(LocalStorageKey.currentLoginUsername)) {
      this.nzMsgService.warning('不能删除自己');
    } else {
      this.modalService.confirm({
        nzTitle: '<i><b>删除用户？</b></i>',
        nzContent: '用户 <strong>' + user.username + '</strong> 将被删除<br/><br/><b>确认继续吗？</b>',
        nzOnOk: () => {
          this.userService.deleteUser(user.username)
            .subscribe(result => {
              if (result != null) {
                this.userList = result;
                this.nzMsgService.success('用户 ' + user.username + ' 删除成功！');
              }
            });
        }
      });
    }
  }

  resetPassword() {
    this.modalService.confirm({
      nzTitle: '<i><b>重置用户密码？</b></i>',
      nzContent: '用户 <strong>' + this.operatingUser.username + '</strong> 的密码即将被重置！<br/>' +
        '重置后的初始密码为：<strong>123456</strong><br/><br/><b>确认真的要重置吗？</b>',
      nzOnOk: () => {
        this.operatingUser.password = '123456';
        this.userService.resetPassword(this.operatingUser)
          .subscribe(result => {
            if (result != null) {
              this.nzMsgService.warning('用户 ' + this.operatingUser.username + ' 密码重置成功，请尽快通知该用户重新登录并修改初始密码!');
            }
            this.updateUserVisible = false;
          });
      }
    });
  }
}
