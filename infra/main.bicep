param location string = resourceGroup().location
param resourceToken string = uniqueString(subscription().id, resourceGroup().id)
param principalId string = ''

// Tags that will be applied to all resources
var tags = {
  'azd-env-name': resourceToken
}

// Container Apps Environment
resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: 'cae-${resourceToken}'
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// Log Analytics Workspace
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: 'law-${resourceToken}'
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// Container Registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: 'acr${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

// MySQL Flexible Server
resource mysqlServer 'Microsoft.DBforMySQL/flexibleServers@2023-06-30' = {
  name: 'mysql-${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: 'floristadmin'
    administratorLoginPassword: 'FloristAdmin@123'
    version: '8.0.21'
    storage: {
      storageSizeGB: 32
      iops: 400
      autoGrow: 'Enabled'
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    network: {
      delegatedSubnetResourceId: ''
      privateDnsZoneResourceId: ''
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

// MySQL Database
resource mysqlDatabase 'Microsoft.DBforMySQL/flexibleServers/databases@2023-06-30' = {
  parent: mysqlServer
  name: 'flower'
  properties: {
    charset: 'utf8mb4'
    collation: 'utf8mb4_unicode_ci'
  }
}

// MySQL Firewall Rule - Allow all Azure IPs
resource mysqlFirewallRule 'Microsoft.DBforMySQL/flexibleServers/firewallRules@2023-06-30' = {
  parent: mysqlServer
  name: 'AllowAllAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// MySQL Firewall Rule - Allow all IPs (for development - remove in production)
resource mysqlFirewallRuleAll 'Microsoft.DBforMySQL/flexibleServers/firewallRules@2023-06-30' = {
  parent: mysqlServer
  name: 'AllowAll'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '255.255.255.255'
  }
}

// User Assigned Managed Identity
resource userAssignedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'mi-${resourceToken}'
  location: location
  tags: tags
}

// Role assignment for ACR Pull
resource acrPullRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(containerRegistry.id, userAssignedIdentity.id, '7f951dda-4ed3-4680-a7ca-43fe172d538d')
  scope: containerRegistry
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
    principalId: userAssignedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Spring Boot Container App
resource floristBackendApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'ca-florist-backend-${resourceToken}'
  location: location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        allowInsecure: false
        corsPolicy: {
          allowedOrigins: ['*']
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
          allowedHeaders: ['*']
          allowCredentials: true
        }
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          identity: userAssignedIdentity.id
        }
      ]
      secrets: [
        {
          name: 'mysql-password'
          value: 'FloristAdmin@123'
        }
        {
          name: 'jwt-secret'
          value: '1XEr+3OcYxBMQmPbU4whr3vHbXOwNYeA7+QmxG6BbZsLtsYzmepgdvYXmKSH57JJHWLOFUznSKstgTmsXRNCdA=='
        }
        {
          name: 'razorpay-secret'
          value: 'mAvxGJVBHaECAdukHDfnrpVH'
        }
        {
          name: 'admin-password'
          value: 'Admin@123'
        }
      ]
    }
    template: {
      containers: [
        {
          image: '${containerRegistry.properties.loginServer}/florist-backend:latest'
          name: 'florist-backend'
          env: [
            {
              name: 'MYSQLHOST'
              value: mysqlServer.properties.fullyQualifiedDomainName
            }
            {
              name: 'MYSQLPORT'
              value: '3306'
            }
            {
              name: 'MYSQLDATABASE'
              value: 'flower'
            }
            {
              name: 'MYSQLUSER'
              value: 'floristadmin'
            }
            {
              name: 'MYSQLPASSWORD'
              secretRef: 'mysql-password'
            }
            {
              name: 'PORT'
              value: '8080'
            }
            {
              name: 'APP_JWT_SECRET'
              secretRef: 'jwt-secret'
            }
            {
              name: 'APP_JWT_EXPIRATION_MS'
              value: '86400000'
            }
            {
              name: 'APP_CORS_ALLOWED_ORIGINS'
              value: 'https://florist-frontend-phi.vercel.app,http://localhost:5173,http://localhost:5174'
            }
            {
              name: 'RAZORPAY_KEY_ID'
              value: 'rzp_test_XD8mdRSpebRkBx'
            }
            {
              name: 'RAZORPAY_KEY_SECRET'
              secretRef: 'razorpay-secret'
            }
            {
              name: 'APP_ADMIN_EMAIL'
              value: 'admin@florist.com'
            }
            {
              name: 'APP_ADMIN_PASSWORD'
              secretRef: 'admin-password'
            }
            {
              name: 'APP_ADMIN_NAME'
              value: 'Platform Admin'
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
  dependsOn: [
    acrPullRole
  ]
}

// Outputs
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.properties.loginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistry.name
output MYSQL_HOST string = mysqlServer.properties.fullyQualifiedDomainName
output BACKEND_URL string = 'https://${floristBackendApp.properties.configuration.ingress.fqdn}'
output RESOURCE_GROUP_NAME string = resourceGroup().name
