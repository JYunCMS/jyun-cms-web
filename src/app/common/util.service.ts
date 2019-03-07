import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UtilService {

  constructor() {
  }

  openSiderMenuHandler(menuValue: string, openMap) {
    for (const key in openMap) {
      if (key !== menuValue) {
        setTimeout(() => openMap[key] = false, 0);
      }
    }
  }

  initLeftSiderStatus(menuValue: string, selectedValue: string, openMap, selectMap) {
    // 关闭其他菜单项，展开指定菜单项
    this.openSiderMenuHandler(menuValue, openMap);
    // 展开指定菜单项目
    setTimeout(() => openMap[menuValue] = true, 0);

    // 选中对应子项
    for (const key in selectMap) {
      if (key !== menuValue + '_' + selectedValue) {
        setTimeout(() => selectMap[key] = false, 0);
      } else {
        setTimeout(() => selectMap[key] = true, 0);
      }
    }
  }
}
