@echo off
echo 👑 Admin Configuration for Railway Deployment
echo =============================================
echo.

echo 🔐 Default Admin Credentials:
echo Email: admin@florist.com
echo Password: Admin@123
echo Name: Platform Admin
echo.

echo 📝 Railway Environment Variables for Admin:
echo.
echo Copy these to Railway Dashboard → Backend Service → Variables:
echo.
echo APP_ADMIN_EMAIL=admin@florist.com
echo APP_ADMIN_PASSWORD=Admin@123
echo APP_ADMIN_NAME=Platform Admin
echo.

echo 🛡️ Security Recommendations:
echo.
echo 🚨 For Production:
echo 1. Change the default password
echo 2. Use your actual business email
echo 3. Use a strong password with special characters
echo.

echo 🔒 Strong Password Examples:
echo - FloristAdmin2025!@#$
echo - BotanicalSecure$2025
echo - FlowerPower@Admin123
echo.

echo 💡 Want to generate a strong admin password? (y/n)
set /p generate="Enter choice: "

if /i "%generate%"=="y" (
    echo.
    echo Generating strong password...
    powershell -Command "[System.Web.Security.Membership]::GeneratePassword(16, 4)"
    echo.
    echo 📝 Use this password for APP_ADMIN_PASSWORD in Railway!
    echo.
)

echo 🧪 Testing Admin Login (after Railway deployment):
echo.
echo curl -X POST https://your-railway-app.railway.app/api/auth/login \
echo   -H "Content-Type: application/json" \
echo   -d '{"email":"admin@florist.com","password":"Admin@123"}'
echo.

echo 🎯 Admin Capabilities:
echo - Manage flower products and categories
echo - View and manage customer orders  
echo - Monitor payments and transactions
echo - Access user management features
echo - View sales analytics and reports
echo.

echo 📊 Next Steps:
echo 1. Add admin variables to Railway Dashboard
echo 2. Deploy your backend service
echo 3. Test admin login endpoint
echo 4. Change password for production use
echo.

echo 📖 For detailed admin setup guide, read: ADMIN-CONFIGURATION.md
echo.
pause
