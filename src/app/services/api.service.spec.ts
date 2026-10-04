import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses the same-origin REST endpoint so packaged deployments work', () => {
    service.getRoutes().subscribe(routes => expect(routes).toEqual([]));
    const request = http.expectOne('/api/routes');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
