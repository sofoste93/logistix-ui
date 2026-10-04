package tech.sofoste.logistix.domain;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** A freight corridor and its remaining capacity. */
public record TransportRoute(
        UUID id,
        List<String> stops,
        double capacityWeightKg,
        double capacityVolumeM3,
        double availableWeightKg,
        double availableVolumeM3,
        RouteStatus status,
        Instant departureTime
) {
    public TransportRoute reserve(double weightKg, double volumeM3) {
        return new TransportRoute(id, stops, capacityWeightKg, capacityVolumeM3,
                availableWeightKg - weightKg, availableVolumeM3 - volumeM3, status, departureTime);
    }
}
