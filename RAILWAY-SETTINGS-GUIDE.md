# 🎯 Railway Dashboard - Step-by-Step Settings Guide

## 📍 **Where to Add These Settings**

### **Path in Railway Dashboard:**
```
Railway Dashboard → Your Project → Backend Service → Variables Tab → Raw Editor
```

## 📝 **Method 1: Individual Variables (Recommended)**

Add each variable one by one in the Railway Variables tab:

### **🗄️ Database Variables (5 variables)**
```
MYSQLHOST = [Copy from MySQL service - see step below]
MYSQLPORT = 3306
MYSQLDATABASE = flower
MYSQLUSER = florist_user
MYSQLPASSWORD = florist_password
```

### **⚙️ Application Variables (2 variables)**
```
SPRING_PROFILES_ACTIVE = railway
PORT = 8080
```

### **🔐 Security Variables (2 variables)**
```
APP_JWT_SECRET = 1XEr+3OcYxBMQmPbU4whr3vHbXOwNYeA7+QmxG6BbZsLtsYzmepgdvYXmKSH57JJHWLOFUznSKstgTmsXRNCdA==
APP_JWT_EXPIRATION_MS = 86400000
```

### **🌐 CORS Variable (1 variable)**
```
APP_CORS_ALLOWED_ORIGINS = https://florist-frontend-phi.vercel.app,http://localhost:5173,http://localhost:5174
```

### **💳 Payment Variables (2 variables)**
```
RAZORPAY_KEY_ID = rzp_test_XD8mdRSpebRkBx
RAZORPAY_KEY_SECRET = mAvxGJVBHaECAdukHDfnrpVH
```

### **👑 Admin Variables (3 variables)**
```
APP_ADMIN_EMAIL = admin@florist.com
APP_ADMIN_PASSWORD = Admin@123
APP_ADMIN_NAME = Platform Admin
```

---

## 📋 **Method 2: Bulk Import (Raw Editor)**

If Railway has a "Raw Editor" or "Import" option, paste this:

```env
MYSQLHOST=mysql.railway.internal
MYSQLPORT=3306
MYSQLDATABASE=flower
MYSQLUSER=florist_user
MYSQLPASSWORD=florist_password
SPRING_PROFILES_ACTIVE=railway
PORT=8080
APP_JWT_SECRET=1XEr+3OcYxBMQmPbU4whr3vHbXOwNYeA7+QmxG6BbZsLtsYzmepgdvYXmKSH57JJHWLOFUznSKstgTmsXRNCdA==
APP_JWT_EXPIRATION_MS=86400000
APP_CORS_ALLOWED_ORIGINS=https://florist-frontend-phi.vercel.app,http://localhost:5173,http://localhost:5174
RAZORPAY_KEY_ID=rzp_test_XD8mdRSpebRkBx
RAZORPAY_KEY_SECRET=mAvxGJVBHaECAdukHDfnrpVH
APP_ADMIN_EMAIL=admin@florist.com
APP_ADMIN_PASSWORD=Admin@123
APP_ADMIN_NAME=Platform Admin
```

---

## 🔍 **Getting the MYSQLHOST Value**

### **Steps to Get MySQL Internal Hostname:**

1. **Go to your Railway project**
2. **Click on MySQL service** (not backend)
3. **Click "Connect" tab**
4. **Look for "Internal URL" or "Private URL"**
5. **Copy the hostname part** (example: `mysql.railway.internal`)
6. **Use this value for MYSQLHOST**

### **Common MySQL Host Formats:**
- `mysql.railway.internal` 
- `servicename.railway.internal`
- Or Railway will show the exact internal URL

---

## ✅ **Verification Checklist**

After adding all variables:

- [ ] **13 variables total** are set
- [ ] **MYSQLHOST** has the correct internal MySQL URL
- [ ] **All variable names** match exactly (case-sensitive)
- [ ] **No extra spaces** in values
- [ ] **Backend service** shows "Deployed" status
- [ ] **Health check** works: `https://your-app.railway.app/actuator/health`

---

## 🚨 **Common Mistakes to Avoid**

1. **Wrong MYSQLHOST**: Must be internal Railway MySQL URL, not external
2. **Typos in variable names**: Must match exactly (APP_JWT_SECRET, not app_jwt_secret)
3. **Missing quotes**: Don't add quotes around values in Railway dashboard
4. **Wrong service**: Add variables to **backend service**, not MySQL service
5. **Case sensitivity**: Variable names are case-sensitive

---

## 🔧 **Railway Dashboard Navigation:**

```
1. Login to Railway → https://railway.app/dashboard
2. Select your project (or create new)
3. You should see two services:
   - MySQL service
   - Backend service (your Spring Boot app)
4. Click on Backend service
5. Go to Variables tab
6. Add the 13 variables listed above
```

---

## 🎯 **Next Steps After Adding Variables:**

1. **Variables added** ✅
2. **Deploy triggers automatically** ⏳
3. **Check logs** for any errors
4. **Test health endpoint** 
5. **Test admin login**
6. **Connect frontend** to Railway backend URL
