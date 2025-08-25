# 🚀 Railway Deployment Guide - Florist Backend

Deploy MySQL and Spring Boot as separate services on Railway platform.

## 🎯 Overview

Railway will host:
- **MySQL Database Service** - Managed MySQL 8.0
- **Spring Boot Backend Service** - Your application

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Git Repository**: Your code should be in GitHub
3. **Railway CLI** (optional but recommended)

## 🚀 Deployment Methods

### Method 1: Railway Dashboard (Recommended for beginners)

#### Step 1: Create MySQL Service
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy MySQL"
4. Configure MySQL:
   - **MYSQL_ROOT_PASSWORD**: `Kavin@2005`
   - **MYSQL_DATABASE**: `flower`
   - **MYSQL_USER**: `florist_user`
   - **MYSQL_PASSWORD**: `florist_password`

#### Step 2: Deploy Backend Service
1. In the same project, click "Add Service"
2. Select "GitHub Repo"
3. Connect your `Florist-Backend` repository
4. Railway will auto-detect it's a Java project

#### Step 3: Configure Backend Environment Variables
Add these variables in the backend service settings:

**Database Connection:**
```
MYSQLHOST=<MySQL_Service_Internal_Host>
MYSQLPORT=3306
MYSQLDATABASE=flower
MYSQLUSER=florist_user
MYSQLPASSWORD=florist_password
```

**Application Configuration:**
```
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

### Method 2: Railway CLI

#### Step 1: Install Railway CLI
```bash
# Windows (PowerShell)
iwr -useb https://railway.app/install.ps1 | iex

# Or using npm
npm install -g @railway/cli
```

#### Step 2: Login and Initialize
```bash
railway login
railway init
```

#### Step 3: Deploy Services
```bash
# Create and deploy MySQL
railway add mysql
railway variables set MYSQL_ROOT_PASSWORD=Kavin@2005
railway variables set MYSQL_DATABASE=flower

# Deploy backend
railway up
```

## 🔧 Configuration Files Created

- **`railway.json`** - Railway project configuration
- **`nixpacks.toml`** - Build configuration for Railway
- **`application-railway.properties`** - Railway-specific Spring Boot config

## 🌐 Getting Connection Details

### From Dashboard:
1. Go to your project
2. Click on MySQL service
3. Go to "Connect" tab
4. Copy the connection details

### From CLI:
```bash
railway variables
```

## 📊 Environment Variables Reference

| Variable | Description | Source |
|----------|-------------|---------|
| `MYSQLHOST` | MySQL hostname | Railway MySQL service |
| `MYSQLPORT` | MySQL port | Usually 3306 |
| `MYSQLDATABASE` | Database name | flower |
| `MYSQLUSER` | Database username | florist_user |
| `MYSQLPASSWORD` | Database password | Set by you |
| `PORT` | Application port | Set by Railway |

## 🔍 Monitoring and Logs

### Dashboard:
- View logs in real-time
- Monitor resource usage
- Check deployment status

### CLI:
```bash
# View logs
railway logs

# Check status
railway status

# Redeploy
railway up
```

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Verify MySQL service is running
   - Check environment variables
   - Ensure internal networking is configured

2. **Build Failed**
   - Check Java version (Railway uses Java 17)
   - Verify Maven build works locally
   - Check logs for specific errors

3. **Application Won't Start**
   - Verify PORT environment variable
   - Check Spring Boot logs
   - Ensure health check endpoint is accessible

### Debug Commands:
```bash
# Check service status
railway status

# View environment variables
railway variables

# Check logs
railway logs --tail

# Restart service
railway restart
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **Database Access**: Use Railway's internal networking
3. **HTTPS**: Railway provides SSL certificates automatically
4. **CORS**: Configure allowed origins properly

## 💰 Pricing

- **Hobby Plan**: Free tier available
- **Pro Plan**: $20/month for advanced features
- **Usage-based**: Pay for what you use

## 🔄 CI/CD Integration

Railway automatically deploys when you push to your connected Git branch:

1. Push code to GitHub
2. Railway detects changes
3. Automatic build and deployment
4. Zero-downtime deployments

## 📈 Scaling

Railway auto-scales based on traffic:
- **CPU**: Automatic scaling
- **Memory**: Up to plan limits
- **Replicas**: Multiple instances for high availability

## 🎯 Next Steps After Deployment

1. **Test Your API**: Use the Railway-provided URL
2. **Connect Frontend**: Update frontend to use Railway backend URL
3. **Monitor Performance**: Use Railway dashboard
4. **Set up Alerts**: Configure notifications for issues

## 📞 Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Community Discord**: Railway Discord server
- **GitHub Issues**: For code-related problems
