@echo off
title Railway Deployment Status Checker
color 0A

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                 🚀 RAILWAY DEPLOYMENT CHECKER                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo 🔍 Current Repository Status:
echo ═══════════════════════════════════════════════════════════════
git status --porcelain
if %errorlevel%==0 (
    echo ✅ Repository is clean - ready for deployment
) else (
    echo ❌ Repository has uncommitted changes
)
echo.

echo 📁 Checking Railway Configuration Files:
echo ═══════════════════════════════════════════════════════════════
if exist "nixpacks.toml" (
    echo ✅ nixpacks.toml - Force Java builds
) else (
    echo ❌ nixpacks.toml - MISSING!
)

if exist "railway.json" (
    echo ✅ railway.json - Railway deployment config
) else (
    echo ❌ railway.json - MISSING!
)

if exist "Procfile" (
    echo ✅ Procfile - Process definition
) else (
    echo ❌ Procfile - MISSING!
)

if exist "pom.xml" (
    echo ✅ pom.xml - Maven project
) else (
    echo ❌ pom.xml - MISSING!
)

if exist ".buildpacks" (
    echo ✅ .buildpacks - Java provider specified
) else (
    echo ❌ .buildpacks - MISSING!
)

echo.
echo 🚫 Checking for Docker Files (Should NOT exist):
echo ═══════════════════════════════════════════════════════════════
if exist "Dockerfile" (
    echo ❌ Dockerfile - SHOULD BE DELETED!
) else (
    echo ✅ No Dockerfile - Good!
)

if exist "docker-compose.yml" (
    echo ❌ docker-compose.yml - SHOULD BE DELETED!
) else (
    echo ✅ No docker-compose.yml - Good!
)

if exist ".dockerignore" (
    echo ❌ .dockerignore - SHOULD BE DELETED!
) else (
    echo ✅ No .dockerignore - Good!
)

echo.
echo 🏗️ Testing Local Build:
echo ═══════════════════════════════════════════════════════════════
echo Testing Maven build...
mvn clean package -DskipTests -q
if %errorlevel%==0 (
    echo ✅ Maven build successful
    if exist "target\florist-backend-1.0.0.jar" (
        echo ✅ JAR file created successfully
    ) else (
        echo ❌ JAR file not found in target directory
    )
) else (
    echo ❌ Maven build failed
)

echo.
echo 📋 DEPLOYMENT CHECKLIST:
echo ═══════════════════════════════════════════════════════════════
echo ┌─ Railway Setup ─────────────────────────────────────────────┐
echo │ □ Create NEW Railway project (don't reuse old one)          │
echo │ □ Connect GitHub repository                                  │
echo │ □ Verify Java/Maven detection (not Docker)                  │
echo │ □ Add 13 environment variables from railway-env-variables.txt│
echo │ □ Create MySQL service in same project                      │
echo │ □ Update MYSQLHOST variable with MySQL service URL          │
echo │ □ Deploy and test health endpoint                           │
echo └─────────────────────────────────────────────────────────────┘
echo.

echo 🎯 Expected Results:
echo ═══════════════════════════════════════════════════════════════
echo • Build time: 2-4 minutes (NOT 6+ minutes)
echo • Build logs: "Building with Java provider" (NOT Docker)
echo • Health check: https://your-app.railway.app/actuator/health
echo • Status: {"status":"UP"}
echo.

echo 📞 Next Steps:
echo ═══════════════════════════════════════════════════════════════
echo 1. Follow FRESH-RAILWAY-DEPLOYMENT.md guide
echo 2. Create completely NEW Railway service
echo 3. Copy environment variables from railway-env-variables.txt
echo 4. Test deployment with health endpoint
echo.

echo ✨ Ready for fresh deployment! Good luck! ✨
echo.
pause
