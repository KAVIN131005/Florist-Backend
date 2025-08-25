# 🚀 Railway Dashboard Quick Setup Reference

## 📍 Step-by-Step Railway Configuration

### 1. Database Service (MySQL)
**Service Name:** `mysql`
**Template:** MySQL 8.0

**Environment Variables:**
```
MYSQL_ROOT_PASSWORD=Kavin@2005
MYSQL_DATABASE=flower
MYSQL_USER=florist_user
MYSQL_PASSWORD=florist_password
```

### 2. Backend Service (Spring Boot)
**Service Name:** `backend`
**Source:** GitHub Repository

**Environment Variables to Add:**

#### Database Connection
```
MYSQLHOST=[Copy from MySQL service internal URL]
MYSQLPORT=3306
MYSQLDATABASE=flower
MYSQLUSER=florist_user
MYSQLPASSWORD=florist_password
```

#### Application Settings
```
SPRING_PROFILES_ACTIVE=railway
PORT=8080
```

#### JWT Configuration
```
APP_JWT_SECRET=1XEr+3OcYxBMQmPbU4whr3vHbXOwNYeA7+QmxG6BbZsLtsYzmepgdvYXmKSH57JJHWLOFUznSKstgTmsXRNCdA==
APP_JWT_EXPIRATION_MS=86400000
```

#### CORS Configuration
```
APP_CORS_ALLOWED_ORIGINS=https://florist-frontend-phi.vercel.app,http://localhost:5173,http://localhost:5174
```

#### Razorpay Payment Gateway
```
RAZORPAY_KEY_ID=rzp_test_XD8mdRSpebRkBx
RAZORPAY_KEY_SECRET=mAvxGJVBHaECAdukHDfnrpVH
```

#### Admin User
```
APP_ADMIN_EMAIL=admin@florist.com
APP_ADMIN_PASSWORD=Admin@123
APP_ADMIN_NAME=Platform Admin
```

## 🔗 Important URLs

- **Railway Dashboard:** https://railway.app/dashboard
- **MySQL Connection:** Get from MySQL service → Connect tab
- **Backend URL:** Get from backend service → Settings tab
- **Logs:** Each service → Logs tab

## ✅ Verification Checklist

- [ ] MySQL service is running
- [ ] Backend service is deployed
- [ ] All environment variables are set
- [ ] Health check works: `/actuator/health`
- [ ] CORS allows your frontend domain
- [ ] JWT authentication works
- [ ] Razorpay keys are configured

## 🚨 Common Issues

**Backend won't start:**
- Check MYSQLHOST is set correctly
- Verify all required environment variables
- Check build logs for errors

**CORS errors:**
- Add your frontend URL to APP_CORS_ALLOWED_ORIGINS
- Ensure no trailing slashes in URLs

**Database connection failed:**
- Verify MYSQL variables match between services
- Check MySQL service is running
