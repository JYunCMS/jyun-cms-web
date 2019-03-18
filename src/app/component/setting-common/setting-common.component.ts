import { Component, OnInit } from '@angular/core';
import { SiderMenuService } from '../../util/sider-menu.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-setting-common',
  templateUrl: './setting-common.component.html',
  styleUrls: ['./setting-common.component.css']
})

export class SettingCommonComponent implements OnInit {

  constructor(
    private utilService: SiderMenuService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('setting', 'common', AppComponent.self.openMap, AppComponent.self.selectMap);
  }
}
