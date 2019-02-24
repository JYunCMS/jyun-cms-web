import { Component, OnInit } from '@angular/core';
import { UtilService } from "../util.service";

@Component({
  selector: 'app-setting-common',
  templateUrl: './setting-common.component.html',
  styleUrls: ['./setting-common.component.css']
})

export class SettingCommonComponent implements OnInit {

  constructor(
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('setting', 'common');
  }
}
