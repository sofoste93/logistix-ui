package tech.sofoste.logistix.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

public record CreateBookingRequest(
        @NotNull UUID routeId,
        @NotBlank String customer,
        @NotBlank String origin,
        @NotBlank String destination,
        @Positive double reservedWeightKg,
        @Positive double reservedVolumeM3
) {
}
