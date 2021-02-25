import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  constructor(private alertCtrl: AlertController) {}

  public async showAlert(header, message, buttons) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: buttons,
    });
    alert.present();
  }

  public async showFirebaseAlert(error) {
    const alert = await this.alertCtrl.create({
      header: "Error",
      message: error.message,
      buttons: ["Okay"],
    });
    alert.present();
  }
}
