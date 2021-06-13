import { AlertService } from './../../services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';
import { LoadingController, AlertController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
})
export class TripDetailsPage implements OnInit {
  tripId;
  tripDetails: any = {};
  detailsLoaded = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tripService: TripService,
    private loadingCtrl: LoadingController,
    private allertService: AlertService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.detailsLoaded = false;
      this.tripId = params.id;
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        this.tripService.getTripById(this.tripId).subscribe((res) => {
          this.tripDetails = res;
          this.detailsLoaded = true;
          console.log(this.tripDetails);

          loadingEl.dismiss();
        });
      });
    });
  }

  formatDate(date) {
    return moment(date).format('MM/DD/YYYY');
  }

  formatFirebaseDate(date) {
    return moment(date.toDate()).format('MM/DD/YYYY');
  }

  getTotalCost(res) {
    let total = 0;
    res.forEach((item) => {
      total = total + parseInt(item.cost);
    });
    return total;
  }
  getTotalAmount(res) {
    let total = 0;
    res.forEach((item) => {
      total = total + parseInt(item.amount);
    });
    return total;
  }

  async deleteTrip() {
    const alert = await this.alertController.create({
      header: 'Warning',
      mode: 'ios',
      message: 'Are you sure you want to delete the trip?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {},
        },
        {
          text: 'Yes',
          handler: () => {
            this.doDelete();
          },
        },
      ],
    });
    await alert.present();
  }

  doDelete() {
    this.loadingCtrl.create().then((loadingEl) => {
      loadingEl.present();
      this.tripService.deleteTrip(this.tripDetails.id).subscribe(
        (res) => {
          loadingEl.dismiss();
          this.router.navigate(['/home']);
        },
        (err) => this.allertService.showFirebaseAlert(err)
      );
    });
  }
}
