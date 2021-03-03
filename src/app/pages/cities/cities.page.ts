import { Component, OnInit } from '@angular/core';
import { ListsService } from 'src/app/services/lists.service';
import { ToastService } from 'src/app/services/toast.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.page.html',
  styleUrls: ['./cities.page.scss'],
})
export class CitiesPage implements OnInit {
  cities = [];
  addedCity = '';
  constructor(
    private listService: ListsService,
    private toastService: ToastService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.listService.getAllCombos().subscribe((res: any) => {
      console.log(res);
      this.cities = res.cities;
    });
  }

  addCity() {
    let added = false;
    if (this.cities.indexOf(this.addedCity) == -1) {
      this.cities.push(this.addedCity);
      this.addedCity = '';
      this.updateCity();
    } else {
      this.toastService.presentToast('City already exists');
    }
  }

  removeCity(city) {
    this.cities.splice(this.cities.indexOf(city), 1);
    this.updateCity();
  }

  updateCity() {
    let data = {
      cities: this.cities,
    };
    this.listService.updateCombo(data).subscribe(
      (res) => {},
      (err) => {
        this.alertService.showFirebaseAlert(err);
      }
    );
  }
}
