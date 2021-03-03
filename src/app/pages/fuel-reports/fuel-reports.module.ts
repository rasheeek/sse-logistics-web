import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FuelReportsPageRoutingModule } from './fuel-reports-routing.module';

import { FuelReportsPage } from './fuel-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FuelReportsPageRoutingModule,
  ],
  declarations: [FuelReportsPage],
})
export class FuelReportsPageModule {}
