@echo off
echo Building and starting Florist Backend services locally...

echo.
echo Checking if Docker is running...
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

echo.
echo Building Maven project...
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Maven build failed.
    exit /b 1
)

echo.
echo Starting services with Docker Compose...
docker-compose up --build -d

if %errorlevel% neq 0 (
    echo ERROR: Failed to start services.
    exit /b 1
)

echo.
echo Services are starting up...
echo Waiting for MySQL to be ready...
timeout /t 10 /nobreak >nul

echo.
echo Checking service health...
docker-compose ps

echo.
echo Services are running!
echo - Backend API: http://localhost:8080
echo - Health Check: http://localhost:8080/actuator/health
echo - MySQL: localhost:3307

echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
