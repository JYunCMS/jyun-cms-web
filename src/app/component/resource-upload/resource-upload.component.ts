import { Component, OnInit } from '@angular/core';
import { UtilService } from "../../common/util.service";
import { AppComponent } from "../app.component";
import { NzMessageService } from "ng-zorro-antd";
import { BackEndApi } from "../../back-end-api";

@Component({
  selector: 'app-resource-upload',
  templateUrl: './resource-upload.component.html',
  styleUrls: ['./resource-upload.component.css']
})

export class ResourceUploadComponent implements OnInit {

  uploadAddress: string = BackEndApi.resources;

  constructor(
    private utilService: UtilService,
    private nzMsgService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('resource', 'upload', AppComponent.self.openMap, AppComponent.self.selectMap);
  }

  handleChange({file}): void {
    const status = file.status;
    if (status !== 'uploading') {
      this.nzMsgService.loading(`${file.name} 上传中……`);
    }
    if (status === 'done') {
      this.nzMsgService.success(`${file.name} 上传成功`);
    } else if (status === 'error') {
      this.nzMsgService.error(`${file.name} 上传失败 \n ${file.error.error.message}`);
    }
  }
}
