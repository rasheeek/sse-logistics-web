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
    { title: 'Reports', url: '/reports', icon: 'document-text' },
    { title: 'Add Drivers', url: '/drivers', icon: 'bus' },
    { title: 'States', url: '/states', icon: 'location' },
    { title: 'Trailers', url: '/trailers', icon: 'bus' },
  ];
  constructor(private cookieService: CookieService, private router: Router) {}

  logOut() {
    this.cookieService.deleteAll();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
