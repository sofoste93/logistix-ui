FROM node:24-alpine AS ui-build
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci
COPY angular.json tsconfig*.json proxy.conf.json ./
COPY public ./public
COPY src ./src
RUN npm run build

FROM maven:3.9-eclipse-temurin-17 AS api-build
WORKDIR /workspace
COPY backend/pom.xml backend/pom.xml
RUN mvn -B -f backend/pom.xml dependency:go-offline
COPY backend/src backend/src
COPY --from=ui-build /workspace/dist dist
RUN mvn -B -f backend/pom.xml package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /opt/logistix
COPY --from=api-build /workspace/backend/target/logistix-api-2.0.0-runner.jar app.jar
EXPOSE 8080
USER 1001
ENTRYPOINT ["java", "-jar", "app.jar"]
