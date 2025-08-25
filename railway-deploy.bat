@echo off
echo 🚀 Railway Deployment Guide for Florist Backend
echo ===============================================
echo.

echo 📋 Prerequisites:
echo 1. Railway account (https://railway.app)
echo 2. Railway CLI installed
echo 3. Git repository
echo.

echo 🔧 Installation Commands:
echo.
echo # Install Railway CLI (Windows - PowerShell):
echo iwr -useb https://railway.app/install.ps1 ^| iex
echo.
echo # Or using npm:
echo npm install -g @railway/cli
echo.

echo 🚀 Deployment Steps:
echo.
echo # 1. Login to Railway
echo railway login
echo.
echo # 2. Create new project
echo railway project create florist-backend
echo.
echo # 3. Add MySQL service
echo railway service create mysql
echo railway service variables set MYSQL_ROOT_PASSWORD=Kavin@2005
echo railway service variables set MYSQL_DATABASE=flower
echo railway service variables set MYSQL_USER=florist_user
echo railway service variables set MYSQL_PASSWORD=florist_password
echo.
echo # 4. Deploy MySQL
echo railway service deploy --service mysql mysql:8.0
echo.
echo # 5. Add backend service
echo railway service create backend
echo.
echo # 6. Set backend environment variables
echo railway service variables set --service backend SPRING_PROFILES_ACTIVE=railway
echo railway service variables set --service backend PORT=8080
echo.
echo # 7. Deploy backend
echo railway service deploy --service backend .
echo.

echo 🔗 After deployment:
echo - Get MySQL connection details: railway service info mysql
echo - Get backend URL: railway service info backend
echo - View logs: railway logs
echo.

echo 💡 Alternative: Use Railway Dashboard
echo 1. Go to https://railway.app/dashboard
echo 2. Create new project
echo 3. Add MySQL service from template
echo 4. Connect your GitHub repo for backend
echo 5. Set environment variables in dashboard

echo.
echo Would you like to install Railway CLI now? (y/n)
set /p install="Enter choice: "

if /i "%install%"=="y" (
    echo.
    echo Installing Railway CLI via PowerShell...
    powershell -Command "iwr -useb https://railway.app/install.ps1 | iex"
    if %errorlevel% equ 0 (
        echo ✅ Railway CLI installed successfully!
    ) else (
        echo ❌ Installation failed. Please try manual installation.
    )
) else (
    echo.
    echo Please install Railway CLI manually when ready.
)

echo.
pause
