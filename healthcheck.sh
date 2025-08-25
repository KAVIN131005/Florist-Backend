#!/bin/sh
# Docker health check script for Spring Boot application

# Check if the application is responding
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "Health check passed"
    exit 0
else
    echo "Health check failed"
    exit 1
fi
