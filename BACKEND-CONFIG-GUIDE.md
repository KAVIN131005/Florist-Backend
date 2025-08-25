# 🔐 Backend Security & Payment Configuration Guide

## 🎯 JWT (JSON Web Token) Configuration

### Purpose
JWT handles user authentication and session management.

### Required Variables:
```env
APP_JWT_SECRET=1XEr+3OcYxBMQmPbU4whr3vHbXOwNYeA7+QmxG6BbZsLtsYzmepgdvYXmKSH57JJHWLOFUznSKstgTmsXRNCdA==
APP_JWT_EXPIRATION_MS=86400000
```

### 🔒 Security Notes:
- **JWT_SECRET**: 64+ character random string
- **EXPIRATION**: 86400000ms = 24 hours
- **Production**: Generate new secret with `openssl rand -hex 64`

### 🛠️ How to Generate New JWT Secret:
```bash
# Method 1: Online generator
# Visit: https://generate-secret.vercel.app/64

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Method 3: PowerShell
[System.Web.Security.Membership]::GeneratePassword(64, 0)
```

---

## 🌐 CORS (Cross-Origin Resource Sharing) Configuration

### Purpose
CORS allows your frontend to communicate with the backend from different domains.

### Required Variable:
```env
APP_CORS_ALLOWED_ORIGINS=https://florist-frontend-phi.vercel.app,http://localhost:5173,http://localhost:5174
```

### 🔧 Frontend Domains to Include:
- **Vercel Production**: `https://florist-frontend-phi.vercel.app`
- **Local Development**: `http://localhost:5173`, `http://localhost:5174`
- **Your Custom Domain**: Add when you have one

### 📝 CORS Configuration Examples:
```env
# Development (allows local testing)
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174

# Production (specific domains only)
APP_CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Mixed (development + production)
APP_CORS_ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:5173,http://localhost:5174
```

---

## 💳 Razorpay Payment Gateway Configuration

### Purpose
Handles payment processing for your florist application.

### Required Variables:
```env
RAZORPAY_KEY_ID=rzp_test_XD8mdRSpebRkBx
RAZORPAY_KEY_SECRET=mAvxGJVBHaECAdukHDfnrpVH
```

### 🧪 Test vs Production Keys:
- **Test Keys**: Start with `rzp_test_` (for development)
- **Live Keys**: Start with `rzp_live_` (for production)

### 🔐 Security Best Practices:
1. **Never expose Secret Key** in frontend code
2. **Use test keys** during development
3. **Rotate keys** periodically
4. **Monitor transactions** in Razorpay dashboard

### 📊 Razorpay Dashboard Access:
- **Login**: https://dashboard.razorpay.com
- **API Keys**: Settings → API Keys
- **Test Mode**: Use for development
- **Live Mode**: Enable after testing

---

## 🚀 Railway Dashboard Setup Steps

### Step 1: Navigate to Variables
1. Go to Railway Dashboard
2. Select your backend service
3. Click "Variables" tab

### Step 2: Add Environment Variables
Copy and paste each variable from `railway-env-variables.txt`:

```env
# Database
MYSQLHOST=<your-mysql-host>
MYSQLPORT=3306
MYSQLDATABASE=flower
MYSQLUSER=florist_user
MYSQLPASSWORD=florist_password

# Application
SPRING_PROFILES_ACTIVE=railway
PORT=8080

# JWT
APP_JWT_SECRET=1XEr+3OcYxBMQmPbU4whr3vHbXOwNYeA7+QmxG6BbZsLtsYzmepgdvYXmKSH57JJHWLOFUznSKstgTmsXRNCdA==
APP_JWT_EXPIRATION_MS=86400000

# CORS
APP_CORS_ALLOWED_ORIGINS=https://florist-frontend-phi.vercel.app,http://localhost:5173,http://localhost:5174

# Razorpay
RAZORPAY_KEY_ID=rzp_test_XD8mdRSpebRkBx
RAZORPAY_KEY_SECRET=mAvxGJVBHaECAdukHDfnrpVH

# Admin
APP_ADMIN_EMAIL=admin@florist.com
APP_ADMIN_PASSWORD=Admin@123
APP_ADMIN_NAME=Platform Admin
```

### Step 3: Getting MySQL Host
1. Go to your MySQL service in Railway
2. Click "Connect" tab
3. Copy the internal hostname
4. Use this for `MYSQLHOST` variable

---

## 🔍 Testing Your Configuration

### 1. Health Check
```bash
curl https://your-railway-app.railway.app/actuator/health
```

### 2. CORS Test
```javascript
// From your frontend console
fetch('https://your-railway-app.railway.app/api/test')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 3. JWT Authentication Test
```bash
# Login endpoint
curl -X POST https://your-railway-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@florist.com","password":"Admin@123"}'
```

---

## 🛡️ Production Security Checklist

### Before Going Live:
- [ ] Generate new JWT secret
- [ ] Switch to Razorpay live keys
- [ ] Update CORS to production domains only
- [ ] Use strong admin password
- [ ] Enable HTTPS (Railway provides this automatically)
- [ ] Set up monitoring and alerts

### Security Headers (Automatic with Railway):
- HTTPS redirect
- HSTS headers
- Secure cookies
- CSRF protection

---

## 🚨 Troubleshooting

### Common Issues:

**CORS Errors:**
- Check frontend URL matches CORS_ALLOWED_ORIGINS
- Ensure no trailing slashes in URLs
- Verify HTTPS vs HTTP in URLs

**JWT Errors:**
- Verify JWT_SECRET is set correctly
- Check token expiration time
- Ensure secret is same across all instances

**Razorpay Errors:**
- Verify API keys are correct
- Check test vs live mode
- Ensure webhook URLs are set (if using webhooks)

### Debug Commands:
```bash
# Check environment variables
railway logs --tail

# Test specific endpoint
curl -v https://your-app.railway.app/api/health
```
