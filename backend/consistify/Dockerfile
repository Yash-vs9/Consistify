FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/consistify-0.0.1-SNAPSHOT.jar.original app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]