# Expense Tracker

A Spring Boot-based expense tracking web application for managing income and expenses.

## Tech Stack
- Java 17
- Spring Boot 3.2.4
- Spring Web
- Spring Data JPA
- MySQL
- HTML, CSS, JavaScript

## Features
- Add and track transactions
- View income and expense records
- Manage user authentication
- Store records in MySQL
- Responsive web interface

## Project Structure
- `src/main/java` - Java backend code
- `src/main/resources/static` - Frontend files
- `src/main/resources/application.properties` - App configuration

## Prerequisites
- Java 17+
- MySQL server
- Git

## Local Setup
1. Open terminal in the project folder.
2. Make sure MySQL is running.
3. Update database credentials in `src/main/resources/application.properties` if required.
4. Start the application:

```powershell
cd D:\EXPENSE TRACKER
java -jar .\target\expense-tracker-1.0.0.jar
```

If port 8080 is already in use:

```powershell
cd D:\EXPENSE TRACKER
java -jar .\target\expense-tracker-1.0.0.jar --server.port=8081
```

Then open:
- http://localhost:8080
- or http://localhost:8081

## GitHub Upload
Run the following commands in the project folder:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/expense-tracker.git
git push -u origin main
```

## Deploy to Cloud
This app can be deployed on services like:
- Render
- Railway
- Heroku
- Fly.io

Typical Java build command:

```bash
./mvnw clean package
```

Typical start command:

```bash
java -jar target/*.jar
```

## Notes
- This project is designed for a backend-powered app and is not meant for static GitHub Pages hosting.
- For production deployment, configure environment variables and DB credentials securely.
