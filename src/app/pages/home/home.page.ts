import { Router } from '@angular/router';
import { MenuController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { TripService } from 'src/app/services/trip.service';
import { AlertService } from 'src/app/services/alert.service';
import { ListsService } from 'src/app/services/lists.service';
import { ToastService } from 'src/app/services/toast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  filterForm: FormGroup;
  monthFirstDay;
  monthLastDay;
  trips = [];
  constructor(
    private menuCtrl: MenuController,
    private tripService: TripService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private loadingCtrl: LoadingController,
    private listService: ListsService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      month: new FormControl('', Validators.compose([Validators.required])),
    });
    let today = new Date();
    this.monthFirstDay = moment(today).startOf('month').format('DD-MM-YYYY');
    this.monthLastDay = moment(today).endOf('month').format('DD-MM-YYYY');
    this.loadDatas();
  }

  loadDatas() {
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      let start = moment(new Date()).startOf('month').format('YYYY-MM-DD');
      let end = moment(new Date())
        .add(1, 'M')
        .startOf('month')
        .format('YYYY-MM-DD');
      this.tripService
        .getAlTripsByMonth(new Date(start), new Date(end))
        .subscribe(
          (res) => {
            console.log(res);
            this.trips = res;
            loadingEl.dismiss();
          },
          (err) => {
            loadingEl.dismiss();
            this.alertService.showFirebaseAlert(err);
          }
        );
    });
  }

  filterClick() {
    if (this.filterForm.valid) {
      let start = moment(this.filterForm.value.month)
        .startOf('month')
        .format('YYYY-MM-DD');
      let end = moment(this.filterForm.value.month)
        .add(1, 'M')
        .startOf('month')
        .format('YYYY-MM-DD');
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        this.tripService
          .getAlTripsByMonth(new Date(start), new Date(end))
          .subscribe(
            (res) => {
              console.log(res);
              this.trips = res;
              this.monthFirstDay = moment(this.filterForm.value.month)
                .startOf('month')
                .format('DD-MM-YYYY');
              this.monthLastDay = moment(this.filterForm.value.month)
                .endOf('month')
                .format('DD-MM-YYYY');
              loadingEl.dismiss();
            },
            (err) => {
              loadingEl.dismiss();
              this.alertService.showFirebaseAlert(err);
            }
          );
      });
    }
  }

  tripClicked(id) {
    this.router.navigate(['trip-details/'], { queryParams: { id: id } });
  }

  formatDate(date) {
    return moment(date.toDate()).format('DD-MM-YYYY');
  }
}
