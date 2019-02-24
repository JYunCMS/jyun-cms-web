import { Component, OnInit } from '@angular/core';
import { UtilService } from "../util.service";

@Component({
  selector: 'app-navigation-tag',
  templateUrl: './navigation-tag.component.html',
  styleUrls: ['./navigation-tag.component.css']
})

export class NavigationTagComponent implements OnInit {

  inputTagName: string;
  inputTagUrlAlias: string;

  data = [
    {
      key: '1',
      name: '笔记',
      age: 32,
      address: 'note',
    },
    {
      key: '2',
      name: 'Java技术',
      age: 42,
      address: 'Java',
    },
    {
      key: '3',
      name: '生活',
      age: 32,
      address: 'life',
    }
  ];

  constructor(
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('navigation', 'tag');
  }

  addNewTag(): void {
    console.log(this.inputTagName);
    console.log(this.inputTagUrlAlias);
  }
}
