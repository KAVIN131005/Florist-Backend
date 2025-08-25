# 👑 Admin Configuration for Florist Backend

## 🔐 Admin User Setup

### Default Admin Credentials
```env
APP_ADMIN_EMAIL=admin@florist.com
APP_ADMIN_PASSWORD=Admin@123
APP_ADMIN_NAME=Platform Admin
```

## 🚀 Railway Environment Variables for Admin

Add these to your Railway Dashboard → Backend Service → Variables:

```env
# Admin User Configuration
APP_ADMIN_EMAIL=admin@florist.com
APP_ADMIN_PASSWORD=Admin@123
APP_ADMIN_NAME=Platform Admin
```

## 🛡️ Production Security Recommendations

### 1. Strong Admin Password
```env
# Instead of Admin@123, use a strong password like:
APP_ADMIN_PASSWORD=FloristAdmin2025!@#$%
```

### 2. Secure Admin Email
```env
# Use your actual admin email:
APP_ADMIN_EMAIL=your-email@yourdomain.com
APP_ADMIN_NAME=Your Name
```

### 3. Generate Strong Password Examples
```bash
# PowerShell command to generate strong password:
[System.Web.Security.Membership]::GeneratePassword(16, 4)

# Example strong passwords:
FloristSecure2025!@#
AdminFlower$2025*&^
Botanical@Admin#123
```

## 🔧 Admin Functionality

### What the Admin Can Do:
- **Manage Products**: Add, edit, delete flower products
- **Manage Categories**: Organize flower categories
- **View Orders**: Monitor customer orders
- **Manage Users**: View customer accounts
- **Handle Payments**: Monitor Razorpay transactions
- **System Settings**: Configure application settings

### Admin API Endpoints:
```
POST /api/auth/login - Admin login
GET /api/admin/users - View all users
GET /api/admin/orders - View all orders
POST /api/admin/products - Add new products
PUT /api/admin/products/{id} - Update products
DELETE /api/admin/products/{id} - Delete products
GET /api/admin/analytics - View sales analytics
```

## 🔍 Admin Login Process

### 1. Login Request
```json
POST /api/auth/login
{
  "email": "admin@florist.com",
  "password": "Admin@123"
}
```

### 2. Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "email": "admin@florist.com",
  "roles": ["ADMIN"]
}
```

### 3. Using Admin Token
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎯 Railway Setup Steps for Admin

### Step 1: Set Admin Variables in Railway
1. Go to Railway Dashboard
2. Select your backend service
3. Click "Variables" tab
4. Add these variables:

```env
APP_ADMIN_EMAIL=admin@florist.com
APP_ADMIN_PASSWORD=Admin@123
APP_ADMIN_NAME=Platform Admin
```

### Step 2: Test Admin Login
After deployment, test with:
```bash
curl -X POST https://your-railway-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@florist.com",
    "password": "Admin@123"
  }'
```

### Step 3: Access Admin Panel
Use the JWT token to access admin endpoints:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-railway-app.railway.app/api/admin/users
```

## 🔒 Security Best Practices

### 1. Environment-Specific Configs
```env
# Development
APP_ADMIN_EMAIL=admin@florist.com
APP_ADMIN_PASSWORD=Admin@123

# Production
APP_ADMIN_EMAIL=admin@yourcompany.com
APP_ADMIN_PASSWORD=YourStrongPassword123!@#
```

### 2. Role-Based Access
The admin user has `ROLE_ADMIN` which provides:
- Full CRUD access to all resources
- User management capabilities
- Order and payment oversight
- System configuration access

### 3. JWT Token Security
- Tokens expire in 24 hours (configurable)
- Tokens are signed with your JWT secret
- Admin tokens include role information

## 🚨 Important Security Notes

### For Production Deployment:
1. **Change Default Password**: Never use `Admin@123` in production
2. **Use Strong Email**: Use your actual business email
3. **Secure JWT Secret**: Generate a new random secret
4. **HTTPS Only**: Railway provides SSL automatically
5. **Monitor Access**: Check logs for admin login attempts

### Password Requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number
- At least 1 special character

## 🔧 Troubleshooting Admin Issues

### Common Problems:

**Can't Login:**
- Check admin email/password in Railway variables
- Verify JWT secret is set correctly
- Check application logs for authentication errors

**Access Denied:**
- Verify user has ADMIN role
- Check JWT token is not expired
- Ensure Authorization header is correctly formatted

**Database Issues:**
- Check if admin user is created in database
- Verify MySQL connection is working
- Check if admin seeder ran successfully

### Debug Commands:
```bash
# Check Railway variables
railway variables

# View application logs
railway logs --tail

# Test database connection
curl https://your-app.railway.app/actuator/health
```

## 📊 Complete Railway Admin Setup Checklist

- [ ] Set `APP_ADMIN_EMAIL` in Railway variables
- [ ] Set `APP_ADMIN_PASSWORD` in Railway variables  
- [ ] Set `APP_ADMIN_NAME` in Railway variables
- [ ] Deploy backend service
- [ ] Test admin login endpoint
- [ ] Verify admin can access protected endpoints
- [ ] Check admin user exists in database
- [ ] Update password for production use
