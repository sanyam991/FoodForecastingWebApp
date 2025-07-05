# Stage 1: Build the Spring Boot application
# Uses a Maven image with Java 17 and Alpine Linux for a lightweight build environment.
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

# Set the working directory inside the container for the build process.
WORKDIR /app

# Copy the pom.xml file first. This allows Docker to cache the dependency download step
# if the pom.xml doesn't change, significantly speeding up subsequent builds.
COPY pom.xml .

# Download project dependencies. The -B flag is for batch mode (non-interactive).
RUN mvn dependency:go-offline -B

# Copy the rest of the application source code into the container.
COPY src ./src

# Package the application into a JAR file.
# -DskipTests skips running tests during the build, which is common for Docker builds
# to speed up the process, assuming tests are run separately in CI/CD.
RUN mvn package -DskipTests

# Stage 2: Run the Spring Boot application
# Uses a slim OpenJDK 17 JRE (Java Runtime Environment) image based on Alpine Linux.
# This image is much smaller than the full JDK image used for building, resulting in a smaller final image.
FROM eclipse-temurin:17-jre-alpine

# Set the working directory for the runtime environment.
WORKDIR /app

# Copy the executable JAR file from the 'builder' stage's /app/target directory
# and rename it to app.jar in the current stage's /app directory.
COPY --from=builder /app/target/*.jar app.jar

# Expose the port your Spring Boot application runs on (default is 8080).
# This informs Docker that the container listens on this port at runtime.
EXPOSE 8080

# Command to run the Spring Boot application when the container starts.
# 'java -jar app.jar' executes the packaged JAR file.
ENTRYPOINT ["java", "-jar", "app.jar"]
