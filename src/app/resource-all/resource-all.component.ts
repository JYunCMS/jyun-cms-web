import { Component, OnInit } from '@angular/core';
import { UtilService } from "../util.service";
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-resource-all',
  templateUrl: './resource-all.component.html',
  styleUrls: ['./resource-all.component.css']
})

export class ResourceAllComponent implements OnInit {

  constructor(
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('resource', 'all', AppComponent.self.openMap, AppComponent.self.selectMap);
  }
}
