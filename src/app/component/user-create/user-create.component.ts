import { Component, OnInit } from '@angular/core';
import { SiderMenuService } from '../../util/sider-menu.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})

export class UserCreateComponent implements OnInit {

  username: string;
  email: string;
  password: string;
  passwordAgain: string;
  selectedValue: string;

  constructor(
    private siderMenuService: SiderMenuService
  ) {
  }

  ngOnInit() {
    this.siderMenuService.initLeftSiderStatus('user', 'create', AppComponent.self.openMap, AppComponent.self.selectMap);
  }

  addNewUser(): void {
    console.log(this.username);
  }
}
