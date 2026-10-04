package tech.sofoste.logistix.api;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.time.Instant;
import java.util.List;

public record CreateRouteRequest(
        @NotEmpty List<@jakarta.validation.constraints.NotBlank String> stops,
        @Positive double capacityWeightKg,
        @Positive double capacityVolumeM3,
        @Future Instant departureTime
) {
}
