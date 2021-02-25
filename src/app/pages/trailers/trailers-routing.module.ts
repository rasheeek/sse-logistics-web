import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrailersPage } from './trailers.page';

const routes: Routes = [
  {
    path: '',
    component: TrailersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrailersPageRoutingModule {}
