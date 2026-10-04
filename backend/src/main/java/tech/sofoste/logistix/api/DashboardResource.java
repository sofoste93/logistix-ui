package tech.sofoste.logistix.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import tech.sofoste.logistix.service.LogisticsStore;

@Path("/api/dashboard")
@Tag(name = "Dashboard")
public class DashboardResource {
    private final LogisticsStore store;

    public DashboardResource(LogisticsStore store) {
        this.store = store;
    }

    @GET
    @Operation(summary = "Return operational headline metrics")
    public DashboardSummary summary() {
        return store.summary();
    }
}
