import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookings',
  imports: [NgFor, CommonModule],  // ✅ Assurer les directives nécessaires
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getBookings().subscribe({
      next: (data) => {
        console.log("🚀 Réservations reçues :", data);
        this.bookings = data;
      },
      error: (error) => {
        console.error("❌ Erreur de récupération des réservations :", error);
      }
    });
  }
}
