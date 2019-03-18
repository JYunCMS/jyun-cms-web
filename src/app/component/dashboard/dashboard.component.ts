import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { SiderMenuService } from '../../util/sider-menu.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private siderMenuService: SiderMenuService
  ) {
  }

  ngOnInit() {
    this.siderMenuService.initLeftSiderStatus('', 'dashboard', AppComponent.self.openMap, AppComponent.self.selectMap);
  }
}
