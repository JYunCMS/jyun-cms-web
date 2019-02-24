import { Component, OnInit } from '@angular/core';
import { UtilService } from "../util.service";
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-user-all',
  templateUrl: './user-all.component.html',
  styleUrls: ['./user-all.component.css']
})

export class UserAllComponent implements OnInit {

  constructor(
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('user', 'all', AppComponent.self.openMap, AppComponent.self.selectMap);
  }
}
