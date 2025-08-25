Deployment and local run instructions for Florist-Backend

Quick plan

- Build the JAR with Maven
- Run locally (jar or Docker)
- Deploy to Railway (link GitHub, set env vars, optional MySQL plugin)

Build (Windows CMD)

```
cd /d K:\florist-backend
.\mvnw.cmd clean package -DskipTests
```

Run locally (jar)

```
cd /d K:\florist-backend
set APP_JWT_SECRET=your-secret
set MYSQLURL=jdbc:mysql://localhost:3306/flower
set MYSQLUSER=root
set MYSQLPASSWORD=pass
java -jar target\florist-backend-1.0.0.jar
```

Run locally (Docker)

```
cd /d K:\florist-backend
docker build -t florist-backend .
docker run -p 8080:8080 -e APP_JWT_SECRET=your-secret -e MYSQLURL="jdbc:mysql://host:3306/db" -e MYSQLUSER=user -e MYSQLPASSWORD=pass florist-backend
```

Railway deployment checklist

1. Push code to GitHub (already done) and ensure `Dockerfile` & `railway.json` are in repo root.
2. On https://railway.app create a new project → Deploy from GitHub → select the repo.
3. In the Railway project, open the service and set these environment variables (do NOT commit secrets to git):

- APP_JWT_SECRET (required)
- APP_JWT_EXPIRATION_MS (default: 86400000)
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- APP_ADMIN_EMAIL
- APP_ADMIN_PASSWORD
- APP_ADMIN_NAME
- APP_CORS_ALLOWED_ORIGINS (comma separated)
- MYSQLURL (optional if you add Railway MySQL plugin)
- MYSQLUSER
- MYSQLPASSWORD

Railway build & run notes

- Railway build command: `./mvnw clean package -DskipTests`
- Railway will use the `Dockerfile` to create an image and start it with: `java -jar /app/app.jar`
- Ensure `target/florist-backend-1.0.0.jar` is produced by the build (maven wrapper does this)

Useful checks after deploy

- Check Logs in Railway dashboard for startup errors
- Test a health endpoint: `GET /actuator/health` or `GET /` depending on your app
- Update `APP_CORS_ALLOWED_ORIGINS` to include your Railway URL after deploy

Security

- Store secrets (DB password, JWT secret, Razorpay secret) in Railway variables, not in repo.

If you want, I can create a GitHub Actions workflow to automatically build and push a Docker image to a registry or help you walk through the Railway UI step by step.
