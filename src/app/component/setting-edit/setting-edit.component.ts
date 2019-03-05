import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../common/util.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-setting-edit',
  templateUrl: './setting-edit.component.html',
  styleUrls: ['./setting-edit.component.css']
})

export class SettingEditComponent implements OnInit {

  constructor(
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('setting', 'edit', AppComponent.self.openMap, AppComponent.self.selectMap);
  }
}
