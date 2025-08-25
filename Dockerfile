# Multi-stage Dockerfile: build the JAR with Maven, then copy to a lightweight runtime image
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy only what we need for a Maven build first to take advantage of layer caching
COPY pom.xml ./
COPY src ./src

# Build the application (skip tests for faster builds in CI). Adjust if you want tests run.
RUN mvn -B package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy the packaged jar from the build stage
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
