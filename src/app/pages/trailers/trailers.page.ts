import { Component, OnInit } from '@angular/core';
import { ListsService } from 'src/app/services/lists.service';
import { ToastService } from 'src/app/services/toast.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-trailers',
  templateUrl: './trailers.page.html',
  styleUrls: ['./trailers.page.scss'],
})
export class TrailersPage implements OnInit {
  trailers = [];
  addedTrailer = '';
  constructor(
    private listService: ListsService,
    private toastService: ToastService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.listService.getAllCombos().subscribe((res: any) => {
      console.log(res);
      this.trailers = res.trailers;
    });
  }

  addState() {
    if (this.trailers.indexOf(this.addedTrailer) == -1) {
      this.trailers.push(this.addedTrailer);
      this.addedTrailer = '';
      this.updateTrailer();
    } else {
      this.toastService.presentToast('Trailer already exists');
    }
  }

  removeTrailer(trailer) {
    this.trailers.splice(this.trailers.indexOf(trailer), 1);
    this.updateTrailer();
  }

  updateTrailer() {
    let data = {
      trailers: this.trailers,
    };
    this.listService.updateCombo(data).subscribe(
      (res) => {},
      (err) => {
        this.alertService.showFirebaseAlert(err);
      }
    );
  }
}
