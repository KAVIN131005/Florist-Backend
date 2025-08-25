# Florist Backend - Deployment Guide

This project deploys MySQL and Spring Boot backend as two separate services.

## Architecture

- **MySQL Database**: Azure Database for MySQL Flexible Server
- **Spring Boot Backend**: Azure Container Apps
- **Infrastructure**: Deployed using Azure Developer CLI (azd) and Bicep

## Local Development with Docker

### Prerequisites
- Docker and Docker Compose installed
- Java 17
- Maven 3.9+

### Running Locally

1. **Build and run with Docker Compose:**
```bash
docker-compose up --build
```

This will start:
- MySQL database on port 3307
- Spring Boot application on port 8080

2. **Access the application:**
- Backend API: http://localhost:8080
- Health check: http://localhost:8080/actuator/health

### Environment Variables for Local Development

The docker-compose.yml file includes all necessary environment variables. You can modify them as needed.

## Azure Cloud Deployment

### Prerequisites
- Azure CLI installed and logged in
- Azure Developer CLI (azd) installed
- Docker installed (for building container images)

### Deployment Steps

1. **Initialize the Azure environment:**
```bash
azd auth login
azd init
```

2. **Deploy to Azure:**
```bash
azd up
```

This command will:
- Create Azure resources (Container Apps, MySQL, Container Registry)
- Build and push the Docker image
- Deploy the application

3. **Monitor the deployment:**
```bash
azd monitor
```

### Azure Resources Created

- **Resource Group**: Contains all resources
- **Azure Container Apps Environment**: Hosting environment for containers
- **Azure Container Registry**: Stores the application container image
- **Azure Database for MySQL**: Managed MySQL database
- **Log Analytics Workspace**: For logging and monitoring
- **Managed Identity**: For secure access between services

### Configuration

The application configuration is managed through:
- Environment variables in the Container App
- Secrets stored securely in Azure
- Database connection managed through Azure networking

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MYSQLHOST | MySQL server hostname | Set by Azure |
| MYSQLPORT | MySQL server port | 3306 |
| MYSQLDATABASE | Database name | flower |
| MYSQLUSER | Database username | floristadmin |
| MYSQLPASSWORD | Database password | Stored as secret |
| APP_JWT_SECRET | JWT signing secret | Stored as secret |
| APP_CORS_ALLOWED_ORIGINS | Allowed CORS origins | Configurable |
| RAZORPAY_KEY_ID | Razorpay API key | rzp_test_XD8mdRSpebRkBx |
| RAZORPAY_KEY_SECRET | Razorpay secret | Stored as secret |

## Database Schema

The application uses JPA/Hibernate to automatically manage the database schema. On first run, tables will be created automatically.

## Security Features

- **Managed Identity**: No hardcoded credentials
- **Secret Management**: Sensitive data stored in Azure secrets
- **Network Security**: MySQL accessible only from Azure services
- **HTTPS**: All external traffic encrypted
- **CORS**: Configured for specific origins

## Monitoring and Logging

- Health checks enabled on both services
- Application logs sent to Azure Log Analytics
- Custom metrics and alerts can be configured

## Scaling

The Container App is configured to:
- Minimum 1 replica
- Maximum 3 replicas
- Auto-scale based on CPU and memory usage

## Troubleshooting

### Local Development
```bash
# Check container logs
docker-compose logs florist-backend
docker-compose logs mysql

# Restart services
docker-compose restart
```

### Azure Deployment
```bash
# Check application logs
azd logs

# Monitor resources
azd monitor

# Redeploy
azd deploy
```

### Common Issues

1. **Database Connection Issues**: Check if MySQL server is running and credentials are correct
2. **Container Build Failures**: Ensure Docker is running and you have sufficient disk space
3. **Azure Deployment Failures**: Check Azure quotas and regional availability

## Development Workflow

1. Make code changes locally
2. Test with `docker-compose up --build`
3. Commit changes to git
4. Deploy to Azure with `azd deploy`

## Clean Up

To remove all Azure resources:
```bash
azd down
```

This will delete the resource group and all associated resources.
