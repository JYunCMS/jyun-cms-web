import { Injectable } from '@angular/core';
import { AppComponent } from "./app.component";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {
  }

  openHandler(menuValue: string): void {
    for (const key in AppComponent.self.openMap) {
      if (key !== menuValue) {
        AppComponent.self.openMap[key] = false;
      }
    }
  }

  initLeftSiderStatus(menuValue: string, selectedValue: string): void {
    // 关闭其他菜单项
    this.openHandler(menuValue);
    // 展开指定菜单项
    setTimeout(() => AppComponent.self.openMap[menuValue] = true, 0);
    setTimeout(() => AppComponent.self.selectMap[menuValue + '_' + selectedValue] = true, 0);
  }
}
