FROM maven:3.8.3-openjdk-17 AS build
COPY . .
RUN mvn -f backend/consistify/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jdk
COPY --from=build backend/consistify/target/consistify-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
