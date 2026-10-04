#!/usr/bin/env sh
set -eu
command -v java >/dev/null 2>&1 || { echo "Java 17 or newer is required." >&2; exit 1; }
command -v mvn >/dev/null 2>&1 || { echo "Maven 3.9 or newer is required." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "Node.js and npm are required." >&2; exit 1; }
[ -d node_modules ] || npm ci
npm run build
mvn -B -f backend/pom.xml package -DskipTests
echo "Logistix is starting at http://localhost:8080"
java -jar backend/target/logistix-api-2.0.0-runner.jar
