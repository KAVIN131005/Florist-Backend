# Docker Build and Deployment Guide

## Optimized Dockerfile Features

### Security Improvements
- ✅ Non-root user (`appuser:appgroup`)
- ✅ Minimal JRE Alpine image (smaller attack surface)
- ✅ Latest Maven and JDK versions

### Performance Optimizations
- ✅ Multi-stage build (smaller final image)
- ✅ Layer caching for dependencies
- ✅ JVM container-aware settings
- ✅ G1 garbage collector for better performance
- ✅ String deduplication to save memory

### Production Features
- ✅ Health checks built-in
- ✅ Proper metadata labels
- ✅ JVM memory optimization (75% of container RAM)
- ✅ No transfer progress for cleaner logs

## Build Commands

### Local Development
```bash
# Build image
docker build -t florist-backend:latest .

# Run with environment variables
docker run -p 8080:8080 \
  -e MYSQLHOST=localhost \
  -e MYSQLPORT=3306 \
  -e MYSQLDATABASE=flower \
  -e MYSQLUSER=root \
  -e MYSQLPASSWORD=yourpass \
  -e APP_JWT_SECRET=yoursecret \
  florist-backend:latest
```

### Production (Railway)
Railway will automatically:
1. Clone your repo
2. Build using this Dockerfile
3. Deploy with your environment variables
4. Run health checks every 30 seconds

## Image Size Comparison
- **Before**: ~400MB+ (full JDK)
- **After**: ~200MB (JRE Alpine + optimizations)

## Health Check
The container includes automatic health checks:
- **Endpoint**: `/actuator/health`
- **Interval**: 30 seconds
- **Timeout**: 3 seconds
- **Start Period**: 60 seconds (for startup)
- **Retries**: 3 attempts

## Environment Variables Required
See `.env.example` for the complete list of required variables.

## Troubleshooting
If build fails:
1. Check Maven wrapper permissions
2. Verify pom.xml syntax
3. Ensure all dependencies are available
4. Check Railway build logs for specific errors
