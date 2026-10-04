package tech.sofoste.logistix.api;

import jakarta.validation.Valid;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import tech.sofoste.logistix.domain.TransportRoute;
import tech.sofoste.logistix.service.LogisticsStore;

import java.net.URI;
import java.util.List;

@Path("/api/routes")
@Tag(name = "Routes")
public class RouteResource {
    private final LogisticsStore store;

    public RouteResource(LogisticsStore store) {
        this.store = store;
    }

    @GET
    @Operation(summary = "List freight routes and their remaining capacity")
    public List<TransportRoute> list() {
        return store.routes();
    }

    @POST
    @Operation(summary = "Create a freight route")
    public Response create(@Valid CreateRouteRequest request) {
        var route = store.addRoute(request);
        return Response.created(URI.create("/api/routes/" + route.id())).entity(route).build();
    }
}
