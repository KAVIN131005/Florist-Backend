@echo off
echo 🚀 Fast Railway Deployment Fix
echo ==============================
echo.

echo 🚨 ISSUE: Railway Docker build taking too long (timeout)
echo.

echo ✅ SOLUTION: Switch to Native Java Build
echo.

echo 📝 CHANGES MADE:
echo - Removed/renamed Dockerfile (forces native Java build)
echo - Updated nixpacks.toml for faster Java build
echo - Optimized memory settings for Railway
echo - Added .railwayignore to exclude unnecessary files
echo - Reduced Maven build verbosity (-q flag)
echo.

echo ⚡ PERFORMANCE OPTIMIZATIONS:
echo - Java build: ~2-3 minutes (vs Docker: ~10+ minutes)
echo - Reduced memory usage: 512MB (vs 1024MB)
echo - Quiet Maven build (less log output)
echo - Excludes Docker files completely
echo.

echo 🎯 Expected Build Time: 2-4 minutes
echo.

echo Ready to push the fast build fix? (y/n)
set /p push="Enter choice: "

if /i "%push%"=="y" (
    echo.
    echo Pushing fast build configuration...
    git add .
    git commit -m "Fix: Switch to fast native Java build for Railway"
    git push origin main
    
    echo.
    echo ✅ Changes pushed! Railway will now use FAST Java build.
    echo.
    echo 📊 What to expect in Railway:
    echo 1. Build starts immediately (no Docker image download)
    echo 2. Maven dependency download: ~1 minute
    echo 3. Spring Boot build: ~1-2 minutes  
    echo 4. Deployment: ~30 seconds
    echo 5. Total time: 2-4 minutes (much faster!)
    echo.
    echo 🌐 Monitor in Railway Dashboard for faster deployment
) else (
    echo.
    echo Push manually when ready:
    echo git add .
    echo git commit -m "Switch to fast Java build"
    echo git push origin main
)

echo.
pause
