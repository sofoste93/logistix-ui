package tech.sofoste.logistix.api;

import jakarta.validation.Valid;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import tech.sofoste.logistix.domain.Booking;
import tech.sofoste.logistix.service.LogisticsStore;

import java.net.URI;
import java.util.List;

@Path("/api/bookings")
@Tag(name = "Bookings")
public class BookingResource {
    private final LogisticsStore store;

    public BookingResource(LogisticsStore store) {
        this.store = store;
    }

    @GET
    @Operation(summary = "List cargo bookings")
    public List<Booking> list() {
        return store.bookings();
    }

    @POST
    @Operation(summary = "Book capacity on an existing route")
    public Response create(@Valid CreateBookingRequest request) {
        var booking = store.addBooking(request);
        return Response.created(URI.create("/api/bookings/" + booking.id())).entity(booking).build();
    }
}
