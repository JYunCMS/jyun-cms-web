import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { UtilService } from '../../common/util.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('', 'dashboard', AppComponent.self.openMap, AppComponent.self.selectMap);
  }
}
