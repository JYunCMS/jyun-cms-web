import { Component, OnInit } from '@angular/core';
import { SiderMenuService } from '../../util/sider-menu.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-setting-edit',
  templateUrl: './setting-edit.component.html',
  styleUrls: ['./setting-edit.component.css']
})

export class SettingEditComponent implements OnInit {

  constructor(
    private siderMenuService: SiderMenuService
  ) {
  }

  ngOnInit() {
    this.siderMenuService.initLeftSiderStatus('setting', 'edit', AppComponent.self.openMap, AppComponent.self.selectMap);
  }
}
