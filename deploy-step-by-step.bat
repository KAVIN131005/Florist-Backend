@echo off
echo 🚀 Complete Railway Deployment Process
echo =====================================
echo.

echo 📋 STEP-BY-STEP DEPLOYMENT GUIDE
echo.

echo =====================================================
echo STEP 1: PREPARE YOUR GITHUB REPOSITORY
echo =====================================================
echo.
echo ✅ Your code is already ready in GitHub!
echo Repository: KAVIN131005/Florist-Backend
echo.
echo Make sure your latest changes are pushed:
echo git add .
echo git commit -m "Ready for Railway deployment"
echo git push origin main
echo.

echo =====================================================
echo STEP 2: GO TO RAILWAY DASHBOARD
echo =====================================================
echo.
echo 1. Open browser and go to: https://railway.app
echo 2. Click "Login" or "Sign Up"
echo 3. Sign in with your GitHub account
echo 4. Click "New Project"
echo.

echo =====================================================
echo STEP 3: ADD MYSQL SERVICE FIRST
echo =====================================================
echo.
echo 1. In your new project, click "Add Service"
echo 2. Select "Database" 
echo 3. Choose "MySQL"
echo 4. Wait for MySQL to deploy (2-3 minutes)
echo.
echo Set these MySQL environment variables:
echo - MYSQL_ROOT_PASSWORD: Kavin@2005
echo - MYSQL_DATABASE: flower
echo - MYSQL_USER: florist_user  
echo - MYSQL_PASSWORD: florist_password
echo.

echo =====================================================
echo STEP 4: ADD BACKEND SERVICE
echo =====================================================
echo.
echo 1. Click "Add Service" again
echo 2. Select "GitHub Repo"
echo 3. Choose "KAVIN131005/Florist-Backend"
echo 4. Railway will auto-detect Java Spring Boot
echo 5. Click "Deploy"
echo.

echo =====================================================
echo STEP 5: CONFIGURE BACKEND VARIABLES
echo =====================================================
echo.
echo 1. Click on your Backend service
echo 2. Go to "Variables" tab
echo 3. Add the 13 environment variables (see list below)
echo 4. Save changes
echo.

echo Variables to add:
echo.
type railway-settings-checklist.txt
echo.

echo =====================================================
echo STEP 6: GET MYSQL CONNECTION INFO
echo =====================================================
echo.
echo 1. Go to MySQL service
echo 2. Click "Connect" tab
echo 3. Copy the "Private Network URL" or "Internal URL"
echo 4. Use this hostname for MYSQLHOST variable in backend
echo.

echo =====================================================
echo STEP 7: WAIT FOR DEPLOYMENT
echo =====================================================
echo.
echo 1. Railway will build your Spring Boot app (5-10 minutes)
echo 2. Watch the build logs in the "Deployments" tab
echo 3. Look for "Build successful" message
echo 4. Service should show "Active" status
echo.

echo =====================================================
echo STEP 8: TEST YOUR DEPLOYMENT
echo =====================================================
echo.
echo 1. Get your app URL from Railway dashboard
echo 2. Test health endpoint: https://your-app.railway.app/actuator/health
echo 3. Test admin login: https://your-app.railway.app/api/auth/login
echo.

echo =====================================================
echo STEP 9: UPDATE FRONTEND (if needed)
echo =====================================================
echo.
echo Update your frontend to use the Railway backend URL:
echo - Replace localhost:8080 with your Railway app URL
echo - Update CORS settings if needed
echo.

echo 🎯 Ready to start? (y/n)
set /p start="Enter choice: "

if /i "%start%"=="y" (
    echo.
    echo 🌐 Opening Railway Dashboard...
    start https://railway.app/dashboard
    echo.
    echo Follow the steps above in the Railway dashboard!
    echo Use the files created in this directory as reference.
) else (
    echo.
    echo No problem! Follow the steps above when you're ready.
)

echo.
echo 📖 Additional help files created:
echo - RAILWAY-SETTINGS-GUIDE.md
echo - railway-settings-checklist.txt  
echo - RAILWAY-DEPLOYMENT.md
echo.
pause
