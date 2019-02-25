import { Component, OnInit } from '@angular/core';
import { UtilService } from "../util.service";
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})

export class UserCreateComponent implements OnInit {

  username: string;
  email: string;
  password: string;
  passwordAgain: string;
  selectedValue: string;

  constructor(
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('user', 'create', AppComponent.self.openMap, AppComponent.self.selectMap);
  }

  addNewUser(): void {
    console.log(this.username);
  }
}
