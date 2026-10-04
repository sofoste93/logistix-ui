package tech.sofoste.logistix.domain;

import java.time.Instant;
import java.util.UUID;

public record Booking(
        UUID id,
        String reference,
        UUID routeId,
        String customer,
        String origin,
        String destination,
        double reservedWeightKg,
        double reservedVolumeM3,
        BookingStatus status,
        Instant createdAt
) {
}
