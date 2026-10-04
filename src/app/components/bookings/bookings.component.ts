import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Booking, TransportRoute } from '../../models/logistics.models';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [DatePipe, DecimalPipe, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent {
  private readonly api = inject(ApiService);
  readonly bookings = signal<Booking[]>([]);
  readonly routes = signal<TransportRoute[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly formOpen = signal(false);
  readonly saving = signal(false);
  readonly selectedRoute = computed(() => this.routes().find(route => route.id === this.newBooking.routeId));

  newBooking = { routeId: '', customer: '', origin: '', destination: '', reservedWeightKg: 500, reservedVolumeM3: 2 };

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    forkJoin({ bookings: this.api.getBookings(), routes: this.api.getRoutes() }).subscribe({
      next: ({ bookings, routes }) => {
        this.bookings.set(bookings.slice().reverse());
        this.routes.set(routes);
        if (!this.newBooking.routeId && routes[0]) this.selectRoute(routes[0].id);
        this.loading.set(false);
        this.error.set('');
      },
      error: () => { this.loading.set(false); this.error.set('The REST API is unavailable. Start Quarkus on port 8080.'); }
    });
  }

  selectRoute(routeId: string): void {
    this.newBooking.routeId = routeId;
    const route = this.routes().find(item => item.id === routeId);
    this.newBooking.origin = route?.stops[0] ?? '';
    this.newBooking.destination = route?.stops.at(-1) ?? '';
  }

  createBooking(): void {
    this.saving.set(true);
    this.api.addBooking(this.newBooking).subscribe({
      next: booking => {
        this.bookings.update(bookings => [booking, ...bookings]);
        this.routes.update(routes => routes.map(route => route.id === booking.routeId
          ? { ...route, availableWeightKg: route.availableWeightKg - booking.reservedWeightKg, availableVolumeM3: route.availableVolumeM3 - booking.reservedVolumeM3 }
          : route));
        this.newBooking.customer = '';
        this.formOpen.set(false);
        this.saving.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(response.error?.message ?? 'The booking could not be created.');
        this.saving.set(false);
      }
    });
  }

  routeName(routeId: string): string {
    const route = this.routes().find(item => item.id === routeId);
    return route ? `${route.stops[0]} → ${route.stops.at(-1)}` : 'Archived route';
  }
}
