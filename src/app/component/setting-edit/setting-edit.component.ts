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
    private utilService: SiderMenuService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('setting', 'edit', AppComponent.self.openMap, AppComponent.self.selectMap);
  }
}
