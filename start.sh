#!/bin/bash
set -e

echo "=== RAILWAY JAVA STARTUP SCRIPT ==="
echo "This is definitely NOT a Docker build!"

# Check Java version
echo "Java version:"
java -version

# Check if JAR exists
if [ -f "app.jar" ]; then
    echo "Found app.jar - starting application..."
    java -Xmx512m -Dserver.port=$PORT -Dspring.profiles.active=railway -jar app.jar
elif [ -f "target/florist-backend-1.0.0.jar" ]; then
    echo "Found target JAR - copying and starting..."
    cp target/florist-backend-1.0.0.jar app.jar
    java -Xmx512m -Dserver.port=$PORT -Dspring.profiles.active=railway -jar app.jar
else
    echo "ERROR: No JAR file found!"
    exit 1
fi
