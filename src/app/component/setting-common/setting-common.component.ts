import { Component, OnInit } from '@angular/core';
import { SiderMenuService } from '../../util/sider-menu.service';
import { AppComponent } from '../app.component';
import { OptionsService } from '../../service/options.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Options } from '../../domain/options';
import { OptionsFields } from '../../config/options-fields';
import { SiteTitle } from '../../domain/options/site-title';
import { CopyrightInfo } from '../../domain/options/copyright-info';
import { WebsiteFilingInfo } from '../../domain/options/website-filing-info';

@Component({
  selector: 'app-setting-common',
  templateUrl: './setting-common.component.html',
  styleUrls: ['./setting-common.component.css']
})

export class SettingCommonComponent implements OnInit {

  // 站点标题相关
  siteTitle: string;
  isLoadingSetSiteTitle = false;

  // 版权信息相关
  copyrightInfo: string;
  isLoadingSetCopyrightInfo = false;

  // 网站备案相关
  websiteFilingInfo: string;
  isLoadingSetWebsiteFilingInfo = false;

  constructor(
    private siderMenuService: SiderMenuService,
    private optionsService: OptionsService,
    private nzMsgService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.siderMenuService.initLeftSiderStatus('setting', 'common', AppComponent.self.openMap, AppComponent.self.selectMap);
    this.optionsService.getOptions()
      .subscribe(result => {
        this.initOptionsList(result);
      });
  }

  private initOptionsList(options: Options[]) {
    for (const option of options) {
      switch (option.name) {
        case OptionsFields.SITE_TITLE:
          // 站点标题
          this.siteTitle = option.value.content.name;
          break;
        case OptionsFields.COPYRIGHT_INFO:
          // 版权信息
          this.copyrightInfo = option.value.content.name;
          break;
        case OptionsFields.WEBSITE_FILING_INFO:
          // 网站备案
          this.websiteFilingInfo = option.value.content.name;
          break;
      }
    }
  }

  setSiteTitle() {
    this.isLoadingSetSiteTitle = true;
    this.optionsService.setSiteTitle(new SiteTitle(this.siteTitle))
      .subscribe(result => {
        if (result != null) {
          this.nzMsgService.success('站点名称更新成功！');
        }
        this.isLoadingSetSiteTitle = false;
      });
  }

  setCopyrightInfo() {
    this.isLoadingSetCopyrightInfo = true;
    this.optionsService.setCopyrightInfo(new CopyrightInfo(this.copyrightInfo))
      .subscribe(result => {
        if (result != null) {
          this.nzMsgService.success('版权信息更新成功！');
        }
        this.isLoadingSetCopyrightInfo = false;
      });
  }

  setWebsiteFilingInfo() {
    this.isLoadingSetWebsiteFilingInfo = true;
    this.optionsService.setWebsiteFilingInfo(new WebsiteFilingInfo(this.websiteFilingInfo))
      .subscribe(result => {
        if (result != null) {
          this.nzMsgService.success('备案信息更新成功！');
        }
        this.isLoadingSetWebsiteFilingInfo = false;
      });
  }
}
