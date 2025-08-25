@echo off
echo Deploying Florist Backend to Azure...

echo.
echo Checking prerequisites...

rem Check if Azure CLI is installed
az version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Azure CLI is not installed. Please install it first.
    echo Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
    exit /b 1
)

rem Check if Azure Developer CLI is installed
azd version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Azure Developer CLI is not installed. Please install it first.
    echo Download from: https://docs.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd
    exit /b 1
)

rem Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

echo All prerequisites are met!

echo.
echo Logging into Azure...
azd auth login
if %errorlevel% neq 0 (
    echo ERROR: Failed to login to Azure.
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
echo Deploying to Azure...
echo This will create Azure resources and deploy your application.
echo.
set /p CONFIRM=Continue with deployment? (y/N): 
if /i not "%CONFIRM%"=="y" (
    echo Deployment cancelled.
    exit /b 0
)

azd up
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed.
    exit /b 1
)

echo.
echo Deployment completed successfully!
echo.
echo Getting deployment information...
azd show

echo.
echo To monitor your application:
echo   azd monitor
echo.
echo To view logs:
echo   azd logs
echo.
echo To update your application:
echo   azd deploy
