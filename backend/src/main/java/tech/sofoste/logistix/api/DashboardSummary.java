package tech.sofoste.logistix.api;

public record DashboardSummary(
        int activeRoutes,
        int bookings,
        double availableWeightKg,
        double capacityUsedPercent
) {
}
