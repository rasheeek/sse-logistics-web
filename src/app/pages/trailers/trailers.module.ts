import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrailersPageRoutingModule } from './trailers-routing.module';

import { TrailersPage } from './trailers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrailersPageRoutingModule
  ],
  declarations: [TrailersPage]
})
export class TrailersPageModule {}
