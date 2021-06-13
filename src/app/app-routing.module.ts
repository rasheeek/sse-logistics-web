import { HomeGuard } from './guards/home.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [HomeGuard],
  },
  {
    path: 'drivers',
    loadChildren: () =>
      import('./pages/drivers/drivers.module').then((m) => m.DriversPageModule),
  },
  {
    path: 'states',
    loadChildren: () =>
      import('./pages/states/states.module').then((m) => m.StatesPageModule),
  },
  {
    path: 'trailers',
    loadChildren: () =>
      import('./pages/trailers/trailers.module').then(
        (m) => m.TrailersPageModule
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./pages/reports/reports.module').then((m) => m.ReportsPageModule),
  },
  {
    path: 'fuel-reports',
    loadChildren: () =>
      import('./pages/fuel-reports/fuel-reports.module').then(
        (m) => m.FuelReportsPageModule
      ),
  },
  {
    path: 'cities',
    loadChildren: () =>
      import('./pages/cities/cities.module').then((m) => m.CitiesPageModule),
  },
  {
    path: 'trip-details',
    loadChildren: () =>
      import('./pages/trip-details/trip-details.module').then(
        (m) => m.TripDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
