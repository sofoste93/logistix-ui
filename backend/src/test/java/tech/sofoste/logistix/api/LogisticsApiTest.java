package tech.sofoste.logistix.api;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;

@QuarkusTest
class LogisticsApiTest {
    @Test
    void createsRouteAndBooksCapacityAtomically() {
        String routeId = given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                        "stops", List.of("Douala", "Yaoundé"),
                        "capacityWeightKg", 1_000,
                        "capacityVolumeM3", 12,
                        "departureTime", Instant.now().plus(2, ChronoUnit.DAYS).toString()
                ))
                .when().post("/api/routes")
                .then().statusCode(201)
                .body("availableWeightKg", equalTo(1000.0f))
                .extract().path("id");

        given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                        "routeId", routeId,
                        "customer", "Learner Logistics",
                        "origin", "Douala",
                        "destination", "Yaoundé",
                        "reservedWeightKg", 250,
                        "reservedVolumeM3", 3
                ))
                .when().post("/api/bookings")
                .then().statusCode(201)
                .body("status", equalTo("CONFIRMED"));

        given().when().get("/api/routes").then().statusCode(200)
                .body("find { it.id == '" + routeId + "' }.availableWeightKg", equalTo(750.0f));
    }

    @Test
    void rejectsInvalidRouteAndExposesOperationalEndpoints() {
        given().contentType(ContentType.JSON)
                .body(Map.of("stops", List.of("Berlin"), "capacityWeightKg", 100,
                        "capacityVolumeM3", 1, "departureTime", Instant.now().plus(1, ChronoUnit.DAYS).toString()))
                .when().post("/api/routes")
                .then().statusCode(409).body("code", equalTo("ROUTE_TOO_SHORT"));

        given().when().get("/api/dashboard").then().statusCode(200)
                .body("activeRoutes", greaterThanOrEqualTo(3));
        given().when().get("/api/bookings").then().statusCode(200).body("$", hasSize(greaterThanOrEqualTo(3)));
        given().when().get("/q/health").then().statusCode(200).body("status", equalTo("UP"));
    }
}
