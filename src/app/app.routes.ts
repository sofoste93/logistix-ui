import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RoutesComponent } from './components/routes/routes.component';
import { BookingsComponent } from './components/bookings/bookings.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, title: 'Logistix · Control center' },
  { path: 'routes', component: RoutesComponent, title: 'Logistix · Routes' },
  { path: 'bookings', component: BookingsComponent, title: 'Logistix · Bookings' },
  { path: '**', redirectTo: '' }
];
