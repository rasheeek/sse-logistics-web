import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DriverService } from 'src/app/services/driver.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-drivers',
  templateUrl: './add-drivers.component.html',
  styleUrls: ['./add-drivers.component.scss'],
})
export class AddDriversComponent implements OnInit {
  driverForm: FormGroup;
  showWarnings: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private driverService: DriverService,
    private toastService: ToastService,
    private modalCtrl: ModalController
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

  dismissModal() {
    this.modalCtrl.dismiss();
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
                isActive: true,
                password: this.driverForm.value.password,
                addedDate: new Date().toISOString(),
              };
              this.driverService
                .addUser(userData, this.driverForm.value.email.toLowerCase())
                .subscribe((res) => {
                  loadingEl.dismiss();
                  this.toastService.presentToast('Driver added successsfully');
                  this.driverForm.reset();
                  this.modalCtrl.dismiss();
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
