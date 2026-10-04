package tech.sofoste.logistix.api;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import tech.sofoste.logistix.service.DomainException;

import java.time.Instant;

@Provider
public class DomainExceptionMapper implements ExceptionMapper<DomainException> {
    @Override
    public Response toResponse(DomainException exception) {
        return Response.status(Response.Status.CONFLICT)
                .entity(new ApiError(exception.code(), exception.getMessage(), Instant.now()))
                .build();
    }

    public record ApiError(String code, String message, Instant timestamp) {
    }
}
