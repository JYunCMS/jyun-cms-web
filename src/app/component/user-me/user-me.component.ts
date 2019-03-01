import { Component, OnInit } from '@angular/core';
import { UtilService } from "../../common/util.service";
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-user-me',
  templateUrl: './user-me.component.html',
  styleUrls: ['./user-me.component.css']
})

export class UserMeComponent implements OnInit {

  username: string;
  email: string;
  password: string;
  passwordAgain: string;

  constructor(
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('user', 'me', AppComponent.self.openMap, AppComponent.self.selectMap);
  }

  updateUserMe() {
    console.log(this.email);
  }
}
