package tech.sofoste.logistix.service;

import jakarta.enterprise.context.ApplicationScoped;
import tech.sofoste.logistix.api.CreateBookingRequest;
import tech.sofoste.logistix.api.CreateRouteRequest;
import tech.sofoste.logistix.api.DashboardSummary;
import tech.sofoste.logistix.domain.Booking;
import tech.sofoste.logistix.domain.BookingStatus;
import tech.sofoste.logistix.domain.RouteStatus;
import tech.sofoste.logistix.domain.TransportRoute;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * In-memory store used for the educational edition.
 *
 * Synchronized write methods keep the capacity check and its update atomic.
 * A production implementation could keep the same REST layer and replace this
 * class with a transactional database repository.
 */
@ApplicationScoped
public class LogisticsStore {
    private final Map<UUID, TransportRoute> routes = new LinkedHashMap<>();
    private final Map<UUID, Booking> bookings = new LinkedHashMap<>();

    public LogisticsStore() {
        seed();
    }

    public synchronized List<TransportRoute> routes() {
        return new ArrayList<>(routes.values());
    }

    public synchronized List<Booking> bookings() {
        return new ArrayList<>(bookings.values());
    }

    public synchronized TransportRoute addRoute(CreateRouteRequest request) {
        if (request.stops().size() < 2) {
            throw new DomainException("ROUTE_TOO_SHORT", "A route needs at least two stops.");
        }

        var route = new TransportRoute(UUID.randomUUID(), List.copyOf(request.stops()),
                request.capacityWeightKg(), request.capacityVolumeM3(),
                request.capacityWeightKg(), request.capacityVolumeM3(),
                RouteStatus.SCHEDULED, request.departureTime());
        routes.put(route.id(), route);
        return route;
    }

    public synchronized Booking addBooking(CreateBookingRequest request) {
        var route = routes.get(request.routeId());
        if (route == null) {
            throw new DomainException("ROUTE_NOT_FOUND", "The selected route no longer exists.");
        }

        int originIndex = route.stops().indexOf(request.origin());
        int destinationIndex = route.stops().indexOf(request.destination());
        if (originIndex < 0 || destinationIndex <= originIndex) {
            throw new DomainException("INVALID_SEGMENT", "Origin and destination must follow the route order.");
        }
        if (request.reservedWeightKg() > route.availableWeightKg()
                || request.reservedVolumeM3() > route.availableVolumeM3()) {
            throw new DomainException("CAPACITY_EXCEEDED", "The requested cargo exceeds the available capacity.");
        }

        routes.put(route.id(), route.reserve(request.reservedWeightKg(), request.reservedVolumeM3()));
        var id = UUID.randomUUID();
        var booking = new Booking(id, "LX-" + id.toString().substring(0, 8).toUpperCase(), route.id(),
                request.customer().trim(), request.origin(), request.destination(),
                request.reservedWeightKg(), request.reservedVolumeM3(), BookingStatus.CONFIRMED, Instant.now());
        bookings.put(booking.id(), booking);
        return booking;
    }

    public synchronized DashboardSummary summary() {
        double total = routes.values().stream().mapToDouble(TransportRoute::capacityWeightKg).sum();
        double available = routes.values().stream().mapToDouble(TransportRoute::availableWeightKg).sum();
        double usedPercent = total == 0 ? 0 : (total - available) / total * 100;
        return new DashboardSummary(routes.size(), bookings.size(), available, Math.round(usedPercent * 10) / 10.0);
    }

    private void seed() {
        var now = Instant.now();
        var northSea = new TransportRoute(UUID.fromString("f4c18c06-228e-4aec-8b2d-98be252f1511"),
                List.of("Hamburg", "Bremen", "Rotterdam"), 24_000, 82, 17_500, 61,
                RouteStatus.BOARDING, now.plus(8, ChronoUnit.HOURS));
        var alpine = new TransportRoute(UUID.fromString("35c0a83a-dc77-4caf-95ed-76b5f183ac6b"),
                List.of("Frankfurt", "Stuttgart", "Zürich"), 18_000, 64, 12_800, 47,
                RouteStatus.SCHEDULED, now.plus(26, ChronoUnit.HOURS));
        var rhine = new TransportRoute(UUID.fromString("55e37d70-4139-45d4-ac4e-3ddcc3898f8d"),
                List.of("Düsseldorf", "Köln", "Liège", "Brussels"), 21_000, 74, 8_900, 31,
                RouteStatus.IN_TRANSIT, now.plus(3, ChronoUnit.HOURS));
        routes.put(northSea.id(), northSea);
        routes.put(alpine.id(), alpine);
        routes.put(rhine.id(), rhine);

        addSeedBooking(northSea, "Mangwa Foods", "Hamburg", "Rotterdam", 6_500, 21, BookingStatus.LOADING);
        addSeedBooking(alpine, "Abakwa Medical", "Frankfurt", "Zürich", 5_200, 17, BookingStatus.CONFIRMED);
        addSeedBooking(rhine, "Sofoste Labs", "Köln", "Brussels", 12_100, 43, BookingStatus.IN_TRANSIT);
    }

    private void addSeedBooking(TransportRoute route, String customer, String origin, String destination,
                                double weight, double volume, BookingStatus status) {
        var id = UUID.randomUUID();
        var booking = new Booking(id, "LX-" + id.toString().substring(0, 8).toUpperCase(), route.id(),
                customer, origin, destination, weight, volume, status, Instant.now().minus(2, ChronoUnit.HOURS));
        bookings.put(id, booking);
    }
}
