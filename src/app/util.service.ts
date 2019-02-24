import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {
  }

  openHandler(menuValue: string, openMap): void {
    for (const key in openMap) {
      if (key !== menuValue) {
        openMap[key] = false;
      }
    }
  }

  initLeftSiderStatus(menuValue: string, selectedValue: string, openMap, selectMap): void {
    // 关闭其他菜单项
    this.openHandler(menuValue, openMap);
    // 展开指定菜单项
    setTimeout(() => openMap[menuValue] = true, 0);
    setTimeout(() => selectMap[menuValue + '_' + selectedValue] = true, 0);
  }
}
