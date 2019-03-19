import { Component, OnInit } from '@angular/core';
import { LocalStorageKey } from '../../config/local-storage-key';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    this.initLoginStatus();
  }

  initLoginStatus() {
    if (!(localStorage.getItem(LocalStorageKey.currentLoginUserToken) == null
      || localStorage.getItem(LocalStorageKey.currentLoginUser) == null
      || localStorage.getItem(LocalStorageKey.currentLoginUsername) == null)) {
      this.router.navigate(['dashboard']);
    }
  }
}
