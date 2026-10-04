export type RouteStatus = 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT';
export type BookingStatus = 'CONFIRMED' | 'LOADING' | 'IN_TRANSIT';

export interface TransportRoute {
  id: string;
  stops: string[];
  capacityWeightKg: number;
  capacityVolumeM3: number;
  availableWeightKg: number;
  availableVolumeM3: number;
  status: RouteStatus;
  departureTime: string;
}

export interface Booking {
  id: string;
  reference: string;
  routeId: string;
  customer: string;
  origin: string;
  destination: string;
  reservedWeightKg: number;
  reservedVolumeM3: number;
  status: BookingStatus;
  createdAt: string;
}

export interface DashboardSummary {
  activeRoutes: number;
  bookings: number;
  availableWeightKg: number;
  capacityUsedPercent: number;
}

export interface CreateRouteRequest {
  stops: string[];
  capacityWeightKg: number;
  capacityVolumeM3: number;
  departureTime: string;
}

export interface CreateBookingRequest {
  routeId: string;
  customer: string;
  origin: string;
  destination: string;
  reservedWeightKg: number;
  reservedVolumeM3: number;
}
