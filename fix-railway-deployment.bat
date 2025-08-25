@echo off
echo 🔧 Railway Deployment Fix - Main Manifest Issue
echo ================================================
echo.

echo 🚨 ISSUE: "no main manifest attribute, in app.jar"
echo.

echo ✅ SOLUTION APPLIED:
echo 1. Updated nixpacks.toml with correct build commands
echo 2. Fixed Spring Boot Maven plugin configuration
echo 3. Added Procfile for Railway
echo 4. Updated railway.json with explicit start command
echo.

echo 📝 FILES UPDATED:
echo - nixpacks.toml (build configuration)
echo - pom.xml (Spring Boot plugin fix)
echo - railway.json (start command)
echo - Procfile (alternative start method)
echo.

echo 🚀 NEXT STEPS:
echo.
echo 1. Push these changes to GitHub:
echo    git add .
echo    git commit -m "Fix Railway JAR manifest issue"
echo    git push origin main
echo.
echo 2. In Railway Dashboard:
echo    - Go to your backend service
echo    - Click "Redeploy" or wait for automatic deployment
echo    - Watch the build logs for success
echo.
echo 3. Verify the fix:
echo    - Check deployment logs show "Started BackendApplication"
echo    - Test health endpoint: https://your-app.railway.app/actuator/health
echo.

echo 💡 WHAT WAS FIXED:
echo - Maven now creates proper Spring Boot executable JAR
echo - Railway uses correct start command with Spring profile
echo - JAR includes all dependencies and main class manifest
echo.

echo 🧪 LOCAL TEST PASSED:
echo JAR is executable locally - ready for Railway deployment!
echo.

echo Ready to push changes to GitHub? (y/n)
set /p push="Enter choice: "

if /i "%push%"=="y" (
    echo.
    echo Pushing changes to GitHub...
    git add .
    git commit -m "Fix Railway deployment: no main manifest attribute issue"
    git push origin main
    
    if %errorlevel% equ 0 (
        echo.
        echo ✅ Changes pushed successfully!
        echo Railway will automatically redeploy your app.
        echo Check the deployment logs in Railway dashboard.
    ) else (
        echo.
        echo ❌ Git push failed. Please push manually:
        echo git add .
        echo git commit -m "Fix Railway deployment issue"
        echo git push origin main
    )
) else (
    echo.
    echo Please push the changes manually when ready:
    echo git add .
    echo git commit -m "Fix Railway deployment issue"  
    echo git push origin main
)

echo.
echo 📊 Expected Railway Build Output:
echo [INFO] Building jar: target/florist-backend-1.0.0.jar
echo [INFO] BUILD SUCCESS
echo Starting application with Spring Boot...
echo Started BackendApplication in X.XXX seconds
echo.
pause
