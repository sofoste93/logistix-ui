import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Booking,
  CreateBookingRequest,
  CreateRouteRequest,
  DashboardSummary,
  TransportRoute
} from '../models/logistics.models';

/** Typed boundary between the Angular application and the Quarkus REST API. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard`);
  }

  getRoutes(): Observable<TransportRoute[]> {
    return this.http.get<TransportRoute[]>(`${this.baseUrl}/routes`);
  }

  addRoute(route: CreateRouteRequest): Observable<TransportRoute> {
    return this.http.post<TransportRoute>(`${this.baseUrl}/routes`, route);
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings`);
  }

  addBooking(booking: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/bookings`, booking);
  }
}
