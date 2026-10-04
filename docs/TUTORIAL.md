# Learn Logistix by following one booking

This short tour explains how the Angular client and Quarkus service cooperate. It is designed for learners: read it once, then keep the files open while debugging the request.

## 1. Start development mode

Use two terminals from the repository root:

```bash
mvn -f backend/pom.xml quarkus:dev
```

```bash
npm ci
npm start
```

Open `http://localhost:4200`. The proxy in `proxy.conf.json` forwards API calls to port 8080, so browser code can always use relative URLs such as `/api/routes`.

## 2. Read the routes

The routes screen calls `ApiService.getRoutes()`. Angular's typed HTTP client converts the JSON response into `TransportRoute[]` for the component.

Try the API directly:

```bash
curl http://localhost:8080/api/routes
```

Follow this path through the code:

1. `src/app/components/routes/routes.component.ts` asks the service for data.
2. `src/app/services/api.service.ts` sends `GET /api/routes`.
3. `backend/src/main/java/tech/sofoste/logistix/api/RouteResource.java` handles the HTTP request.
4. `LogisticsStore.listRoutes()` returns immutable route records.
5. Quarkus REST serializes those records as JSON.

## 3. Create a booking

Choose a route and enter cargo in the booking form. The client sends a small request object instead of sending its entire screen state:

```json
{
  "routeId": 1,
  "customerName": "Thor Family Cargo",
  "origin": "Hamburg",
  "destination": "Rotterdam",
  "weightTons": 1.5,
  "volumeCubicMeters": 4
}
```

You can send the same request from a terminal:

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"routeId":1,"customerName":"Thor Family Cargo","origin":"Hamburg","destination":"Rotterdam","weightTons":1.5,"volumeCubicMeters":4}'
```

The important server steps are:

1. Jakarta Bean Validation rejects missing names and non-positive cargo values.
2. `LogisticsStore` checks that both stops exist in the selected route and occur in the right order.
3. It checks weight and volume together inside one synchronized operation.
4. It creates the booking and subtracts both values from available capacity.
5. The API responds with HTTP `201 Created` and the new booking.

Domain failures use clear HTTP `409 Conflict` responses. Try booking more weight than a route has available and inspect the browser's Network panel.

## 4. Explore the contract

Open `http://localhost:8080/q/swagger-ui` to inspect and call every endpoint. The machine-readable OpenAPI document is available at `http://localhost:8080/q/openapi`.

The health endpoint is useful for containers and release smoke tests:

```bash
curl http://localhost:8080/q/health
```

## 5. Run the tests

```bash
npm test
mvn -f backend/pom.xml test
```

The Angular tests check the API contract and component behavior. The Quarkus integration test starts the application, creates a route and booking through HTTP, and verifies that capacity decreases.

## 6. A good next learning mission

Replace the in-memory `LogisticsStore` with a repository backed by PostgreSQL:

1. Add Quarkus Hibernate ORM with Panache and the PostgreSQL driver.
2. Turn routes and bookings into database entities.
3. Move the synchronized booking operation into a transaction with row locking.
4. Add a migration tool such as Flyway.
5. Keep the REST resources and Angular API contract unchanged.

That exercise teaches persistence and concurrency while preserving the working UI.
