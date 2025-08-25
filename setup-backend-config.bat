@echo off
echo 🔐 Railway Backend Configuration Setup
echo ========================================
echo.

echo This script will guide you through setting up JWT, CORS, and Razorpay
echo configuration for your Railway deployment.
echo.

echo 📋 Configuration Files Created:
echo - railway-env-variables.txt (Copy these to Railway Dashboard)
echo - BACKEND-CONFIG-GUIDE.md (Detailed configuration guide)
echo.

echo 🚀 Quick Setup Steps:
echo.
echo 1. Go to Railway Dashboard: https://railway.app/dashboard
echo 2. Select your backend service
echo 3. Click "Variables" tab
echo 4. Copy variables from railway-env-variables.txt
echo.

echo 🔐 Security Configuration:
echo.
echo JWT Configuration:
echo - Secret: 64-character random string (provided)
echo - Expiration: 24 hours (86400000 ms)
echo.
echo CORS Configuration:
echo - Vercel Frontend: https://florist-frontend-phi.vercel.app
echo - Local Development: http://localhost:5173, http://localhost:5174
echo.
echo Razorpay Configuration:
echo - Test Key ID: rzp_test_XD8mdRSpebRkBx
echo - Test Secret: mAvxGJVBHaECAdukHDfnrpVH
echo.

echo 📝 Environment Variables to Set in Railway:
echo.
type railway-env-variables.txt
echo.

echo 🔍 Want to generate a new JWT secret? (y/n)
set /p generate="Enter choice: "

if /i "%generate%"=="y" (
    echo.
    echo Generating new JWT secret...
    powershell -Command "[System.Web.Security.Membership]::GeneratePassword(64, 10)"
    echo.
    echo Copy this new secret and update APP_JWT_SECRET in Railway!
)

echo.
echo 🌐 Next Steps:
echo 1. Copy variables to Railway Dashboard
echo 2. Deploy your backend service
echo 3. Test with: curl https://your-app.railway.app/actuator/health
echo 4. Update frontend to use Railway backend URL
echo.

echo 📖 For detailed guidance, read: BACKEND-CONFIG-GUIDE.md
echo.
pause
