import { Routes } from '@angular/router';
import { RoutesComponent } from './components/routes/routes.component';
import { BookingsComponent } from './components/bookings/bookings.component';

export const routes: Routes = [
  { path: 'routes', component: RoutesComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: '', redirectTo: '/routes', pathMatch: 'full' } // ✅ Redirection par défaut
];
