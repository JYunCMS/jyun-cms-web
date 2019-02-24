import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  isCollapsed = false;

  openMap = {
    sub1: false,
    sub2: false,
    sub3: false,
    sub4: false,
    sub5: false
  };

  openHandler(value: string): void {

    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }
}
