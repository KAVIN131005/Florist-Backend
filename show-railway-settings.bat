@echo off
echo 🔧 Railway Dashboard Settings Guide
echo ===================================
echo.

echo 📍 Location: Railway Dashboard → Your Project → Backend Service → Variables Tab
echo.

echo 📝 Required Environment Variables:
echo.
echo ==========================================
echo DATABASE CONNECTION
echo ==========================================
echo Variable Name: MYSQLHOST
echo Value: [Copy from MySQL service internal URL]
echo.
echo Variable Name: MYSQLPORT  
echo Value: 3306
echo.
echo Variable Name: MYSQLDATABASE
echo Value: flower
echo.
echo Variable Name: MYSQLUSER
echo Value: florist_user
echo.
echo Variable Name: MYSQLPASSWORD
echo Value: florist_password
echo.

echo ==========================================
echo APPLICATION SETTINGS
echo ==========================================
echo Variable Name: SPRING_PROFILES_ACTIVE
echo Value: railway
echo.
echo Variable Name: PORT
echo Value: 8080
echo.

echo ==========================================
echo JWT SECURITY
echo ==========================================
echo Variable Name: APP_JWT_SECRET
echo Value: 1XEr+3OcYxBMQmPbU4whr3vHbXOwNYeA7+QmxG6BbZsLtsYzmepgdvYXmKSH57JJHWLOFUznSKstgTmsXRNCdA==
echo.
echo Variable Name: APP_JWT_EXPIRATION_MS
echo Value: 86400000
echo.

echo ==========================================
echo CORS CONFIGURATION
echo ==========================================
echo Variable Name: APP_CORS_ALLOWED_ORIGINS
echo Value: https://florist-frontend-phi.vercel.app,http://localhost:5173,http://localhost:5174
echo.

echo ==========================================
echo RAZORPAY PAYMENTS
echo ==========================================
echo Variable Name: RAZORPAY_KEY_ID
echo Value: rzp_test_XD8mdRSpebRkBx
echo.
echo Variable Name: RAZORPAY_KEY_SECRET
echo Value: mAvxGJVBHaECAdukHDfnrpVH
echo.

echo ==========================================
echo ADMIN USER
echo ==========================================
echo Variable Name: APP_ADMIN_EMAIL
echo Value: admin@florist.com
echo.
echo Variable Name: APP_ADMIN_PASSWORD
echo Value: Admin@123
echo.
echo Variable Name: APP_ADMIN_NAME
echo Value: Platform Admin
echo.

echo 🔍 How to Get MySQL Host:
echo 1. Go to your MySQL service in Railway
echo 2. Click "Connect" tab
echo 3. Copy the internal hostname
echo 4. Use this for MYSQLHOST variable
echo.

echo 📊 Total Variables: 13
echo.
echo 💡 Pro Tip: Copy variable names exactly as shown above!
echo.
pause
