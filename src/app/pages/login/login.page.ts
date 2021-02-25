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
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    private cookieService: CookieService
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.cookieService.set('email', 'test@test.com', 7);
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
              loadingEl.dismiss();
              console.log(res);
              localStorage.setItem('email', this.loginForm.value.email);
              this.router.navigate(['/home']);
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
}
