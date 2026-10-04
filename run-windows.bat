@echo off
setlocal
if not defined JAVA_HOME (echo JAVA_HOME must point to Java 17 or newer.& exit /b 1)
if not exist "%JAVA_HOME%\bin\java.exe" (echo JAVA_HOME does not contain java.exe.& exit /b 1)
where mvn >nul 2>nul || (echo Maven 3.9 or newer is required.& exit /b 1)
where npm >nul 2>nul || (echo Node.js and npm are required.& exit /b 1)
if not exist node_modules call npm ci || exit /b 1
call npm run build || exit /b 1
call mvn -B -f backend\pom.xml package -DskipTests || exit /b 1
echo Logistix is starting at http://localhost:8080
"%JAVA_HOME%\bin\java.exe" -jar backend\target\logistix-api-2.0.0-runner.jar
