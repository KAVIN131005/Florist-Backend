# Multi-stage Dockerfile optimized for Railway deployment
# Build stage - use Maven with OpenJDK 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

# Set build arguments for optimization
ARG MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"
ENV MAVEN_OPTS=$MAVEN_OPTS

WORKDIR /workspace

# Copy Maven wrapper and configuration first for better caching
COPY .mvn/ .mvn/
COPY mvnw mvnw.cmd pom.xml ./

# Make Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies (this layer will be cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline -B --no-transfer-progress

# Copy source code
COPY src/ ./src/

# Build the application
RUN ./mvnw clean package -DskipTests -B --no-transfer-progress \
    && mv target/*.jar target/app.jar

# Runtime stage - use minimal JRE image
FROM eclipse-temurin:17-jre-alpine AS runtime

# Add metadata
LABEL maintainer="Florist Backend"
LABEL version="1.0.0"
LABEL description="Spring Boot Florist Backend API"

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Install curl for health checks (optional)
RUN apk add --no-cache curl

# Copy JAR from build stage
COPY --from=build --chown=appuser:appgroup /workspace/target/app.jar app.jar

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM optimization for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+UseStringDeduplication"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
