import { AddDriversComponent } from './../../component/add-drivers/add-drivers.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriversPageRoutingModule } from './drivers-routing.module';

import { DriversPage } from './drivers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,

    DriversPageRoutingModule,
  ],
  declarations: [DriversPage, AddDriversComponent],
})
export class DriversPageModule {}
