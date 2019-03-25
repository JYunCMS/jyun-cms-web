import { Component, OnInit } from '@angular/core';
import { SiderMenuService } from '../../util/sider-menu.service';
import { AppComponent } from '../app.component';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { BackEndApi } from '../../config/back-end-api';
import { OptionsService } from '../../service/options.service';
import { Options } from '../../domain/options';
import { OptionsFields } from '../../config/options-fields';
import { HomeCarouselImages } from '../../domain/options/home-carousel-images';
import { FriendlyLinks } from '../../domain/options/friendly-links';

@Component({
  selector: 'app-setting-edit',
  templateUrl: './setting-home.component.html',
  styleUrls: ['./setting-home.component.css']
})

export class SettingHomeComponent implements OnInit {

  uploadAddress: string = BackEndApi.upload;

  // 轮播图相关
  showCarouselImages = false;
  isLoadingSetHomeCarouselImages = false;
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  carouselImagesList = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  // 友情链接相关
  isLoadingSetFriendlyLinks = false;
  friendlyLinksList: FriendlyLinks[] = [];

  constructor(
    private siderMenuService: SiderMenuService,
    private optionsService: OptionsService,
    private nzMsgService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.siderMenuService.initLeftSiderStatus('setting', 'home', AppComponent.self.openMap, AppComponent.self.selectMap);
    this.optionsService.getOptions()
      .subscribe(result => {
        this.initOptionsList(result);
      });
  }

  private initOptionsList(options: Options[]) {
    for (const option of options) {
      switch (option.name) {
        case OptionsFields.HOME_CAROUSEL_IMAGES:
          // 首页轮播图
          for (const homeCarouselImages of option.value.content) {
            this.carouselImagesList.push({
              uid: new Date(),
              status: 'done',
              url: BackEndApi.hostAddress + '/' + homeCarouselImages.imageLocation
            });
          }
          break;
        case OptionsFields.FRIENDLY_LINKS:
          // 友情链接
          for (const friendlyLinks of option.value.content) {
            this.friendlyLinksList.push(friendlyLinks);
          }
          break;
      }
    }

    this.showCarouselImages = true;
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
    console.log(this.carouselImagesList);
  };

  setHomeCarouselImages() {
    this.isLoadingSetHomeCarouselImages = true;
    const homeCarouselImagesList: HomeCarouselImages[] = [];
    for (const carouselImage of this.carouselImagesList) {
      if (carouselImage.url != null) {
        homeCarouselImagesList.push(new HomeCarouselImages(
          carouselImage.url.substring(BackEndApi.hostAddress.length + 1, carouselImage.url.length)));
      } else if (carouselImage.response.location != null) {
        homeCarouselImagesList.push(new HomeCarouselImages(carouselImage.response.location));
      }
    }
    this.optionsService.setHomeCarouselImages(homeCarouselImagesList)
      .subscribe(result => {
        if (result != null) {
          this.nzMsgService.success('首页轮播图更新成功！');
        }
        this.isLoadingSetHomeCarouselImages = false;
      });
  }

  addFriendlyLinksItem() {
    this.friendlyLinksList.push(new FriendlyLinks(null, null));
  }

  removeFriendlyLinksItem(friendlyLinks: FriendlyLinks) {
    this.friendlyLinksList.splice(this.friendlyLinksList.indexOf(friendlyLinks), 1);
  }

  setFriendlyLinks() {
    this.isLoadingSetFriendlyLinks = true;
    this.optionsService.setFriendlyLinks(this.friendlyLinksList)
      .subscribe(result => {
        if (result != null) {
          this.nzMsgService.success('友情链接更新成功！');
        }
        this.isLoadingSetFriendlyLinks = false;
      });
  }
}
