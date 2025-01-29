import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-routes',
  standalone: true,  // ✅ Angular standalone API
  imports: [NgFor, CommonModule],  // ✅ Assurer les directives nécessaires
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {
  routes: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getRoutes().subscribe(data => {
      this.routes = data;
    });
  }
}
