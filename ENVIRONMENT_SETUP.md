# Environment Configuration Setup

This document explains how to use the environment configurations in the E-Learning Angular application.

## Environment Files

The application uses three environment files:

- `src/environments/environment.ts` - Development environment (default)
- `src/environments/environment.staging.ts` - Staging environment
- `src/environments/environment.prod.ts` - Production environment

## Build Commands

### Development
```bash
ng serve
# or
ng serve --configuration=development
```

### Staging
```bash
ng serve --configuration=staging
ng build --configuration=staging
```

### Production
```bash
ng serve --configuration=production
ng build --configuration=production
```

## Environment Configuration

Each environment file contains the following configuration:

```typescript
export const environment = {
  production: boolean,           // Environment flag
  apiUrl: string,               // API base URL
  appName: string,              // Application name
  version: string,              // Application version
  enableDebug: boolean,         // Debug mode flag
  logLevel: string,             // Logging level
  features: {                   // Feature flags
    enableNotifications: boolean,
    enableAnalytics: boolean,
    enableOfflineMode: boolean
  },
  auth: {                       // Authentication configuration
    tokenKey: string,
    refreshTokenKey: string,
    tokenExpiryKey: string
  },
  upload: {                     // File upload configuration
    maxFileSize: number,
    allowedTypes: string[]
  }
};
```

## Using Environment Service

The `EnvironmentService` provides easy access to environment configurations:

```typescript
import { EnvironmentService } from './core/services/environment.service';

constructor(private envService: EnvironmentService) {}

// Get API URL
const apiUrl = this.envService.getApiUrl();

// Check if production
const isProd = this.envService.isProduction();

// Check feature flags
const analyticsEnabled = this.envService.isFeatureEnabled('enableAnalytics');

// Get upload configuration
const maxFileSize = this.envService.getMaxFileSize();
```

## Environment-Specific Values

### Development
- API URL: `https://localhost:7001/api`
- Debug: Enabled
- Log Level: Debug
- Analytics: Disabled
- Offline Mode: Disabled
- Max File Size: 10MB

### Staging
- API URL: `https://staging-api.elearning.com/api`
- Debug: Enabled
- Log Level: Warn
- Analytics: Enabled
- Offline Mode: Disabled
- Max File Size: 25MB

### Production
- API URL: `https://api.elearning.com/api`
- Debug: Disabled
- Log Level: Error
- Analytics: Enabled
- Offline Mode: Enabled
- Max File Size: 50MB

## Adding New Environment Variables

1. Add the variable to all environment files
2. Update the `EnvironmentService` with appropriate getter methods
3. Update this documentation

## Best Practices

1. **Never commit sensitive data** to environment files
2. **Use feature flags** for environment-specific features
3. **Validate environment variables** at application startup
4. **Use TypeScript interfaces** for type safety
5. **Document all environment variables** in this file 