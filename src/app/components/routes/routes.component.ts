import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { TransportRoute } from '../../models/logistics.models';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [DatePipe, DecimalPipe, FormsModule],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent {
  private readonly api = inject(ApiService);
  readonly routes = signal<TransportRoute[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly query = signal('');
  readonly formOpen = signal(false);
  readonly saving = signal(false);
  readonly filteredRoutes = computed(() => {
    const needle = this.query().trim().toLocaleLowerCase();
    return this.routes().filter(route => !needle || route.stops.join(' ').toLocaleLowerCase().includes(needle));
  });

  newRoute = {
    stops: 'Hamburg, Hannover, Berlin',
    capacityWeightKg: 16000,
    capacityVolumeM3: 52,
    departureTime: this.tomorrow()
  };

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.getRoutes().subscribe({
      next: routes => { this.routes.set(routes); this.loading.set(false); this.error.set(''); },
      error: () => { this.loading.set(false); this.error.set('The REST API is unavailable. Start Quarkus on port 8080.'); }
    });
  }

  createRoute(): void {
    const stops = this.newRoute.stops.split(',').map(stop => stop.trim()).filter(Boolean);
    this.saving.set(true);
    this.api.addRoute({ ...this.newRoute, stops, departureTime: new Date(this.newRoute.departureTime).toISOString() }).subscribe({
      next: route => {
        this.routes.update(routes => [...routes, route]);
        this.formOpen.set(false);
        this.saving.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(response.error?.message ?? 'The route could not be created.');
        this.saving.set(false);
      }
    });
  }

  usedPercent(route: TransportRoute): number {
    return Math.round((1 - route.availableWeightKg / route.capacityWeightKg) * 100);
  }

  private tomorrow(): string {
    const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 16);
  }
}
