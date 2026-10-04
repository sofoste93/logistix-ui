import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { RoutesComponent } from './routes.component';

describe('RoutesComponent', () => {
  it('loads routes and calculates allocated capacity', async () => {
    const route = { id: 'r1', stops: ['A', 'B'], capacityWeightKg: 1000, capacityVolumeM3: 10,
      availableWeightKg: 650, availableVolumeM3: 6, status: 'SCHEDULED' as const, departureTime: new Date().toISOString() };
    await TestBed.configureTestingModule({
      imports: [RoutesComponent],
      providers: [{ provide: ApiService, useValue: { getRoutes: () => of([route]) } }]
    }).compileComponents();

    const component = TestBed.createComponent(RoutesComponent).componentInstance;
    expect(component.routes()).toEqual([route]);
    expect(component.usedPercent(route)).toBe(35);
  });
});
