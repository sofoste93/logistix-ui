import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080'; // 🔥 Backend Quarkus

  constructor(private http: HttpClient) { }

  // 📌 Récupérer toutes les routes
  getRoutes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/routes`);
  }

  // 📌 Ajouter une nouvelle route
  addRoute(route: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/routes`, route);
  }

  // 📌 Récupérer toutes les réservations
  getBookings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bookings`);
  }

  // 📌 Ajouter une réservation
  addBooking(booking: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookings`, booking);
  }
}
