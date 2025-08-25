@echo off
echo =================================================================
echo                 FLORIST BACKEND - SETUP GUIDE
echo =================================================================
echo.

echo This script will help you install the required tools for deployment.
echo.

:MENU
echo Choose your deployment option:
echo.
echo 1. Install Azure CLI and Azure Developer CLI for cloud deployment
echo 2. Check Docker status for local development
echo 3. Run local development environment (requires Docker Desktop)
echo 4. Deploy to Azure (requires Azure tools)
echo 5. View setup status
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto INSTALL_AZURE
if "%choice%"=="2" goto CHECK_DOCKER
if "%choice%"=="3" goto RUN_LOCAL
if "%choice%"=="4" goto DEPLOY_AZURE
if "%choice%"=="5" goto STATUS
if "%choice%"=="6" goto EXIT
echo Invalid choice. Please try again.
goto MENU

:INSTALL_AZURE
echo.
echo Installing Azure CLI...
echo.
echo Please download and install Azure CLI from:
echo https://aka.ms/installazurecliwindows
echo.
echo After installation, download Azure Developer CLI from:
echo https://aka.ms/azure-dev/install
echo.
echo OR use PowerShell (Run as Administrator):
echo.
echo # Install Azure CLI
echo Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
echo Start-Process msiexec.exe -ArgumentList '/I AzureCLI.msi /quiet' -Wait
echo.
echo # Install Azure Developer CLI
echo powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"
echo.
pause
goto MENU

:CHECK_DOCKER
echo.
echo Checking Docker status...
docker --version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH.
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    goto MENU
)

docker ps 2>nul
if %errorlevel% neq 0 (
    echo WARNING: Docker is installed but Docker Desktop is not running.
    echo Please start Docker Desktop and wait for it to fully load.
    echo Look for the whale icon in your system tray.
) else (
    echo SUCCESS: Docker is running and ready!
)
echo.
pause
goto MENU

:RUN_LOCAL
echo.
echo Starting local development environment...
echo.

rem Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Desktop is not running.
    echo Please start Docker Desktop first and try again.
    pause
    goto MENU
)

echo Building Maven project...
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Maven build failed.
    pause
    goto MENU
)

echo Starting services with Docker Compose...
docker-compose up --build -d

if %errorlevel% neq 0 (
    echo ERROR: Failed to start services.
    pause
    goto MENU
)

echo.
echo SUCCESS! Services are starting...
echo.
echo Waiting for services to be ready...
timeout /t 15 /nobreak >nul

echo Checking service status...
docker-compose ps

echo.
echo Services are running!
echo - Backend API: http://localhost:8080
echo - Health Check: http://localhost:8080/actuator/health
echo - MySQL: localhost:3307
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
echo.
pause
goto MENU

:DEPLOY_AZURE
echo.
echo Deploying to Azure...
echo.

rem Check if Azure CLI is available
az version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Azure CLI is not installed.
    echo Please install it first using option 1.
    pause
    goto MENU
)

rem Check if Azure Developer CLI is available
azd version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Azure Developer CLI is not installed.
    echo Please install it first using option 1.
    pause
    goto MENU
)

echo Azure tools are available!
echo.
echo Starting Azure deployment...
call deploy-azure.bat
pause
goto MENU

:STATUS
echo.
echo =================================================================
echo                        SETUP STATUS
echo =================================================================
echo.

echo Checking Maven...
mvn -version 2>nul
if %errorlevel% neq 0 (
    echo Maven: NOT FOUND
) else (
    echo Maven: OK
)

echo.
echo Checking Docker...
docker --version 2>nul
if %errorlevel% neq 0 (
    echo Docker: NOT INSTALLED
) else (
    echo Docker: INSTALLED
    docker ps >nul 2>&1
    if %errorlevel% neq 0 (
        echo Docker Status: NOT RUNNING
    ) else (
        echo Docker Status: RUNNING
    )
)

echo.
echo Checking Azure CLI...
az version >nul 2>&1
if %errorlevel% neq 0 (
    echo Azure CLI: NOT INSTALLED
) else (
    echo Azure CLI: OK
)

echo.
echo Checking Azure Developer CLI...
azd version >nul 2>&1
if %errorlevel% neq 0 (
    echo Azure Developer CLI: NOT INSTALLED
) else (
    echo Azure Developer CLI: OK
)

echo.
echo Checking project build...
if exist "target\florist-backend-1.0.0.jar" (
    echo Project JAR: EXISTS
) else (
    echo Project JAR: NOT BUILT
)

echo.
echo =================================================================
pause
goto MENU

:EXIT
echo.
echo Thank you for using Florist Backend Setup!
echo.
exit /b 0
