Use official OpenJDK image
FROM openjdk:17-jdk-slim

Set working directory
WORKDIR /app

Copy jar file (replace with your jar name if fixed)
COPY target/*.jar app.jar

Expose port
EXPOSE 8080

Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]