import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { PreferencesService } from '../../services/preferences.service';
import { DashboardSummary, TransportRoute } from '../../models/logistics.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private readonly api = inject(ApiService);
  readonly preferences = inject(PreferencesService);
  readonly summary = signal<DashboardSummary | null>(null);
  readonly routes = signal<TransportRoute[]>([]);
  readonly connected = signal(false);

  constructor() {
    this.load();
  }

  load(): void {
    forkJoin({ summary: this.api.getSummary(), routes: this.api.getRoutes() }).subscribe({
      next: ({ summary, routes }) => {
        this.summary.set(summary);
        this.routes.set(routes.slice(0, 3));
        this.connected.set(true);
      },
      error: () => this.connected.set(false)
    });
  }

  routeProgress(route: TransportRoute): number {
    return Math.round((1 - route.availableWeightKg / route.capacityWeightKg) * 100);
  }

  departure(route: TransportRoute): string {
    return new Intl.DateTimeFormat(this.preferences.language(), { weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(route.departureTime));
  }
}
