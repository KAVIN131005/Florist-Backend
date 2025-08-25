@echo off
cd /d %~dp0
echo Building the project...
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 (
  echo Build failed.
  exit /b %errorlevel%
)

setlocal
set APP_JWT_SECRET=%1
if "%APP_JWT_SECRET%"=="" set /p APP_JWT_SECRET=Enter APP_JWT_SECRET: 
set MYSQLURL=%2
if "%MYSQLURL%"=="" set /p MYSQLURL=Enter MYSQLURL: 
set MYSQLUSER=%3
if "%MYSQLUSER%"=="" set /p MYSQLUSER=Enter MYSQLUSER: 
set MYSQLPASSWORD=%4
if "%MYSQLPASSWORD%"=="" set /p MYSQLPASSWORD=Enter MYSQLPASSWORD: 

set JAVA_CMD=java -jar target\florist-backend-1.0.0.jar

echo Starting application with:
	echo APP_JWT_SECRET=%APP_JWT_SECRET:~0,8%********
	echo MYSQLURL=%MYSQLURL%
	echo MYSQLUSER=%MYSQLUSER%

set "APP_JWT_SECRET=%APP_JWT_SECRET%"
set "MYSQLURL=%MYSQLURL%"
set "MYSQLUSER=%MYSQLUSER%"
set "MYSQLPASSWORD=%MYSQLPASSWORD%"

%JAVA_CMD%
endlocal
