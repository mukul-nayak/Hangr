#FROM amd64/openjdk:21-jdk-slim
##FROM eclipse-temurin:21-jre-alpine
#WORKDIR /app
#COPY target/chat-app-backend-0.0.1-SNAPSHOT.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "app.jar"]

# Two stage build — compiles AND runs
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM amd64/openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/target/chat-app-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]