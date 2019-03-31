import { Component, OnInit } from '@angular/core';
import { SiderMenuService } from '../../util/sider-menu.service';
import { AppComponent } from '../app.component';
import { User } from '../../domain/user';
import { UserRoleFields } from '../../config/user-role-fields';
import { UserService } from '../../service/user.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})

export class UserCreateComponent implements OnInit {

  user: User = new User(null, '123456', null, null);
  roleList = UserRoleFields.roleList;
  isLoadingAddNewUser = false;

  constructor(
    private siderMenuService: SiderMenuService,
    private userService: UserService,
    private nzMsgService: NzMessageService,
    private router: Router,
    private modalService: NzModalService
  ) {
  }

  ngOnInit() {
    this.siderMenuService.initLeftSiderStatus('user', 'create', AppComponent.self.openMap, AppComponent.self.selectMap);
  }

  addNewUser(): void {
    if (this.user.username == null || this.user.username === '') {
      this.nzMsgService.warning('用户名不能为空！');
      return;
    }
    if (this.user.role == null || this.user.role === '') {
      this.nzMsgService.warning('用户角色不能为空！');
      return;
    }
    this.isLoadingAddNewUser = true;
    this.userService.addNewUser(this.user)
      .subscribe(result => {
        if (result != null) {
          this.modalService.confirm({
            nzTitle: '<i><b>提醒</b></i>',
            nzContent: '用户 <strong>' + this.user.username + '</strong> 创建成功！<br/>' +
              '初始密码为：<strong>123456</strong>',
          });
          this.router.navigate(['user', 'all']);
        }
        this.isLoadingAddNewUser = false;
      });
  }
}
