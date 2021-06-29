import { ToastService } from './../../services/toast.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  year = new Date().getFullYear();
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    private cookieService: CookieService,
    private userService: UserService,
    private alertService: AlertService,
    private toastService: ToastService
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ),
    });
  }

  async handleLoginUser() {
    if (this.loginForm.valid) {
      this.loadingCtrl
        .create({ keyboardClose: true, cssClass: 'loading-ctrl' })
        .then((loadingEl) => {
          loadingEl.present();
          let userDetails = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password,
          };
          this.authService.loginUser(userDetails).then(
            (res) => {
              this.cookieService.set('email', this.loginForm.value.email, 1);
              this.userService.getUserDetails().subscribe(
                (resp: any) => {
                  loadingEl.dismiss();
                  if (resp.isAdmin) {
                    this.cookieService.set('isAdmin', resp.isAdmin, 1);
                    this.router.navigate(['/home'], { replaceUrl: true });
                  } else {
                    this.toastService.presentToast('Invalid admin credentials');
                  }
                },
                async (err) => {
                  loadingEl.dismiss();
                  await this.alertService.showFirebaseAlert(err);
                }
              );
            },
            async (err) => {
              loadingEl.dismiss();
              const alert = await this.alertCtrl.create({
                header: 'Invalid credentials',
                message: err.message,
                buttons: ['Okay'],
              });
              await alert.present();
            }
          );
        });
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Alert',
        message: 'Please check whether all the fields are correct and valid',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }

  goToLink() {
    window.open('https://www.linkedin.com/in/rasheek/', '_blank');
  }
}
