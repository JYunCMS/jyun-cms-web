import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../common/util.service';
import { AppComponent } from '../app.component';
import { Resource } from '../../domain/resource';
import { ResourceService } from '../../service/resource.service';
import { BackEndApi } from '../../back-end-api';
import { NzModalService } from 'ng-zorro-antd';
import { ResourceFilterConditions } from '../../domain/response/resource-filter-conditions';

@Component({
  selector: 'app-resource-all',
  templateUrl: './resource-all.component.html',
  styleUrls: ['./resource-all.component.css']
})

export class ResourceAllComponent implements OnInit {

  backEndHostAddress: string = BackEndApi.hostAddress;

  selectedDate: string = null;
  selectedType: string = null;

  resources: Resource[] = [];
  filterConditions: ResourceFilterConditions = null;
  sortName: string = null;
  sortValue: string = null;
  displayData = [...this.resources];

  constructor(
    private utilService: UtilService,
    private resourceService: ResourceService,
    private modalService: NzModalService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('resource', 'all', AppComponent.self.openMap, AppComponent.self.selectMap);
    this.resourceService.getResources()
      .subscribe(result => this.initResources(result));
  }

  private initResources(resources: Resource[]) {
    this.resources = resources;
    this.displayData = [...this.resources];
    this.resourceService.getFilterConditions()
      .subscribe(result => this.filterConditions = result);
  }

  sort(sort: { key: string; value: string }) {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  private search() {
    const resource = [...this.resources];
    if (this.sortName && this.sortValue) {
      this.displayData = resource.sort((a, b) =>
        (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) : (b[this.sortName] > a[this.sortName] ? 1 : -1));
    } else {
      this.displayData = resource;
    }
  }

  showDeleteConfirm(resource: Resource): void {
    if (resource.referenceCount === 0 || resource.referenceCount == null) {
      this.modalService.confirm({
        nzTitle: '<i><b>警告：</b></i>',
        nzContent: '资源 ' + resource.originalFilename + ' 将被从服务器删除<br/><br/><b>确认继续吗？</b>',
        nzOnOk: () => this.deleteResource(resource)
      });
    } else {
      this.modalService.confirm({
        nzTitle: '<i><b>严重警告：</b></i>',
        nzContent: '资源 ' + resource.originalFilename + '<br/>被 ' + resource.referenceCount +
          ' 篇文章引用<br/>继续删除，涉及文章将受影响<br/><br/><b>确认继续吗？</b>',
        nzOnOk: () => this.deleteResource(resource)
      });
    }
  }

  private deleteResource(resource: Resource): void {
    this.resourceService.deleteResource(resource.location)
      .subscribe(result => this.initResources(result));
  }

  getByConditions() {
    this.resourceService.getByConditions(this.selectedDate, this.selectedType)
      .subscribe(result => this.initResources(result));
  }
}
