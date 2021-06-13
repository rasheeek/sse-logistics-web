import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {}

  public async showAlert(header, message, buttons) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: buttons,
    });
    alert.present();
  }

  public async showFirebaseAlert(error) {
    if (error.code != 'permission-denied') {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: error.message,
        buttons: ['Okay'],
      });
      alert.present();
    } else {
      this.authService.signOut();
    }
  }
}
