@echo off
echo 🌸 Starting Florist Backend (Localhost Only)
echo ===============================================
echo.
echo Starting Spring Boot application...
echo Backend will be available at: http://localhost:8080
echo Health check: http://localhost:8080/actuator/health
echo.
echo Default Admin User:
echo   Email: admin@localhost.dev
echo   Password: admin123
echo.
echo Press Ctrl+C to stop the server
echo ===============================================
echo.

java -jar target\florist-backend-1.0.0.jar

echo.
echo Backend stopped.
pause