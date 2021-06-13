import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router,
    private cookieService: CookieService
  ) {}

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password).then(
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth
          .signOut()
          .then(() => {
            console.log('LOG Out');
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }

  userDetails() {
    return this.afAuth.user;
  }

  public checkAuthState() {
    var that = this;
    this.afAuth.onAuthStateChanged(function (user) {
      if (user) {
        console.log('logged in', user);

        // User is signed in.
      } else {
        that.ngZone.run(() => {
          that.signOut();
        });
      }
    });
  }

  async signOut() {
    await this.afAuth.signOut();
    this.cookieService.deleteAll();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
