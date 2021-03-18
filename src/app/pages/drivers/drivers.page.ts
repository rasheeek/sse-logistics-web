import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';
import { AddDriversComponent } from './../../component/add-drivers/add-drivers.component';
import { ToastService } from './../../services/toast.service';
import { DriverService } from './../../services/driver.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
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

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.page.html',
  styleUrls: ['./drivers.page.scss'],
})
export class DriversPage implements OnInit {
  driverForm: FormGroup;
  showWarnings: boolean = false;
  drivers = [];
  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private driverService: DriverService,
    private toastService: ToastService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private alertService: AlertService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.driverService.getAlDrivers().subscribe(
        (res) => {
          console.log(res);
          this.drivers = res;
          loadingEl.dismiss();
        },
        (err) => {
          loadingEl.dismiss();
        }
      );
    });
  }

  async addDriver() {
    const modal = await this.modalCtrl.create({
      component: AddDriversComponent,
    });

    return await modal.present().catch((err) => {
      console.log(err);
    });
  }

  async deleteDriver(id) {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure you want to delete this driver?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {},
        },
        {
          text: 'Yes',
          handler: () => {
            this.doDeleteDriver(id);
          },
        },
      ],
    });
    await alert.present();
  }

  doDeleteDriver(id) {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Deleting user...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.userService.deleteUser(id).subscribe(
          (res) => {
            console.log('Res for delete ', res);
            let data = {
              isActive: false,
            };
            this.userService.updateUser(id, data).subscribe(
              (res) => {
                loadingEl.dismiss();
                this.toastService.presentToast('Driver deleted');
              },
              (err) => {
                loadingEl.dismiss();
                this.alertService.showFirebaseAlert(err);
              }
            );
          },
          (err) => {
            loadingEl.dismiss();
            this.alertService.showFirebaseAlert(err);
          }
        );
      });
  }
}
