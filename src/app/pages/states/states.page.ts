import { AlertService } from './../../services/alert.service';
import { ToastService } from './../../services/toast.service';
import { ListsService } from './../../services/lists.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-states',
  templateUrl: './states.page.html',
  styleUrls: ['./states.page.scss'],
})
export class StatesPage implements OnInit {
  states = [];
  addedState = '';
  constructor(
    private listService: ListsService,
    private toastService: ToastService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.listService.getAllCombos().subscribe((res: any) => {
      console.log(res);
      this.states = res.states;
    });
  }

  addState() {
    let added = false;
    if (this.states.indexOf(this.addedState) == -1) {
      this.states.push(this.addedState);
      this.addedState = '';
      this.updateState();
    } else {
      this.toastService.presentToast('State already exists');
    }
  }

  removeState(state) {
    this.states.splice(this.states.indexOf(state), 1);
    this.updateState();
  }

  updateState() {
    let data = {
      states: this.states,
    };
    this.listService.updateCombo(data).subscribe(
      (res) => {},
      (err) => {
        this.alertService.showFirebaseAlert(err);
      }
    );
  }
}
