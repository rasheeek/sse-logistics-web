import { ToastService } from './../../services/toast.service';
import { DriverService } from './../../services/driver.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.page.html',
  styleUrls: ['./drivers.page.scss'],
})
export class DriversPage implements OnInit {
  driverForm: FormGroup;
  showWarnings: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private driverService: DriverService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.driverForm = this.formBuilder.group({
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

      name: new FormControl('', Validators.compose([Validators.required])),
      address: new FormControl('', Validators.compose([Validators.required])),
      mobile: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  async handleSignUp() {
    this.showWarnings = true;
    if (this.driverForm.valid) {
      this.loadingCtrl
        .create({ keyboardClose: true, cssClass: 'loading-ctrl' })
        .then((loadingEl) => {
          loadingEl.present();
          let userDetails = {
            email: this.driverForm.value.email,
            password: this.driverForm.value.password,
          };

          this.authService.registerUser(userDetails).then(
            (res) => {
              let userData = {
                name: this.driverForm.value.name,
                address: this.driverForm.value.address,
                mobile: this.driverForm.value.mobile,
                isAdmin: false,
                addedDate: new Date().toISOString(),
              };
              this.driverService
                .addUser(userData, this.driverForm.value.email)
                .subscribe((res) => {
                  loadingEl.dismiss();
                  this.toastService.presentToast('Driver added successsfully');
                  this.driverForm.reset();
                });
            },
            async (err) => {
              loadingEl.dismiss();
              //       this.errorMessage = err.message;
              const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: 'Alert',
                message: err.message,
                buttons: ['OK'],
              });

              await alert.present();
            }
          );
        });
    } else {
      this.toastService.presentToast(
        'All the fields should be filled and valid'
      );
    }
  }
}
