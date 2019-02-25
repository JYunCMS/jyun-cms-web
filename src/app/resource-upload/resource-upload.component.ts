import { Component, OnInit } from '@angular/core';
import { UtilService } from "../util.service";
import { AppComponent } from "../app.component";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: 'app-resource-upload',
  templateUrl: './resource-upload.component.html',
  styleUrls: ['./resource-upload.component.css']
})

export class ResourceUploadComponent implements OnInit {

  constructor(
    private utilService: UtilService,
    private nzMsgService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('resource', 'upload', AppComponent.self.openMap, AppComponent.self.selectMap);
  }

  // tslint:disable-next-line:typedef
  handleChange({file, fileList}): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.nzMsgService.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.nzMsgService.error(`${file.name} file upload failed.`);
    }
  }
}
