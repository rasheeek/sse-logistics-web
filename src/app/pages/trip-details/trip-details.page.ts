import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';
import { LoadingController } from '@ionic/angular';
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
    private loadingCtrl: LoadingController
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
    return moment(date).format('DD-MM-YYYY');
  }

  formatFirebaseDate(date) {
    return moment(date.toDate()).format('DD-MM-YYYY');
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
}
