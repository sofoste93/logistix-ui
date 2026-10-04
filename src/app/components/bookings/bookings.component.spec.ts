import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { BookingsComponent } from './bookings.component';

describe('BookingsComponent', () => {
  it('selects valid default endpoints from a loaded route', async () => {
    const route = { id: 'r1', stops: ['Douala', 'Yaoundé'], capacityWeightKg: 1000, capacityVolumeM3: 10,
      availableWeightKg: 1000, availableVolumeM3: 10, status: 'SCHEDULED' as const, departureTime: new Date().toISOString() };
    await TestBed.configureTestingModule({
      imports: [BookingsComponent],
      providers: [{ provide: ApiService, useValue: { getBookings: () => of([]), getRoutes: () => of([route]) } }]
    }).compileComponents();

    const component = TestBed.createComponent(BookingsComponent).componentInstance;
    expect(component.newBooking.origin).toBe('Douala');
    expect(component.newBooking.destination).toBe('Yaoundé');
  });
});
