import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Trip reports', url: '/reports', icon: 'document-text' },
    { title: 'Fuel reports', url: '/fuel-reports', icon: 'document-text' },
    { title: 'Drivers', url: '/drivers', icon: 'bus' },
    { title: 'States', url: '/states', icon: 'location' },
    { title: 'Cities', url: '/cities', icon: 'location' },
    { title: 'Tractors', url: '/trailers', icon: 'bus' },
  ];
  constructor(private auth: AuthService) {
    this.auth.checkAuthState();
  }

  logOut() {
    this.auth.signOut();
  }
}
