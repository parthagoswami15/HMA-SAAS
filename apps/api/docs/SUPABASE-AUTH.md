# Supabase JWT Authentication

This document outlines the Supabase JWT authentication setup for the application.

## Overview

The application uses Supabase for authentication with JWT (JSON Web Tokens). The setup includes:

- User registration and login via email/password
- JWT token generation and validation
- Protected routes with role-based access control
- Token refresh mechanism
- Test endpoints for verification

## Setup

1. **Environment Variables**

   Ensure these environment variables are set in your `.env` file:

   ```
   # Supabase
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   
   # JWT
   JWT_SECRET=your-jwt-secret
   JWT_ACCESS_SECRET=your-access-token-secret
   JWT_ACCESS_EXPIRATION=15m
   JWT_REFRESH_SECRET=your-refresh-token-secret
   JWT_REFRESH_EXPIRATION=7d
   
   # App
   APP_URL=http://localhost:3000
   ```

2. **Database Setup**

   Run the Supabase migration script to set up the required tables and RLS policies:

   ```bash
   npm run supabase:migrate
   ```

## Authentication Flow

1. **User Registration**
   - Endpoint: `POST /auth/supabase/signup`
   - Creates a new user in Supabase Auth
   - Sends a confirmation email if email confirmation is enabled

2. **User Login**
   - Endpoint: `POST /auth/supabase/signin`
   - Validates user credentials
   - Returns access and refresh tokens

3. **Access Token**
   - Short-lived (15 minutes by default)
   - Used for authenticating API requests
   - Sent in the `Authorization` header: `Bearer <token>`

4. **Refresh Token**
   - Long-lived (7 days by default)
   - Used to obtain a new access token
   - Should be stored securely (HTTP-only cookie recommended)

## Protecting Routes

Use the `@UseGuards(SupabaseAuthGuard)` decorator to protect routes:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('protected')
@UseGuards(SupabaseAuthGuard)
export class ProtectedController {
  @Get()
  getData() {
    return { message: 'This is a protected route' };
  }
}
```

## Accessing User Information

Use the `@CurrentUser()` decorator to access the authenticated user:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/decorators/current-user.decorator';

@Controller('profile')
@UseGuards(SupabaseAuthGuard)
export class ProfileController {
  @Get()
  getProfile(@CurrentUser() user: AuthUser) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      // Other user properties
    };
  }
}
```

## Testing Authentication

1. **Test Endpoints**

   - `GET /auth/test/public` - Public endpoint (no auth required)
   - `GET /auth/test/protected` - Protected endpoint (requires valid JWT)
   - `GET /auth/test/admin` - Admin-only endpoint (requires admin role)

2. **Run Tests**

   ```bash
   # Run Supabase auth tests
   npm run test:supabase-auth
   ```

## Troubleshooting

### Common Issues

1. **Invalid JWT**
   - Ensure the token is correctly formatted
   - Check that the JWT secret matches between your app and Supabase
   - Verify the token hasn't expired

2. **CORS Issues**
   - Configure CORS in your Supabase dashboard
   - Ensure your frontend URL is whitelisted

3. **RLS (Row Level Security) Issues**
   - Check that RLS policies are correctly set up
   - Verify the JWT contains the expected claims

## Security Considerations

- Always use HTTPS in production
- Store sensitive keys in environment variables
- Use HTTP-only cookies for refresh tokens
- Implement rate limiting on authentication endpoints
- Regularly rotate your JWT secrets
- Keep Supabase client libraries up to date

## References

- [Supabase Documentation](https://supabase.com/docs)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://auth0.com/docs/secure/tokens/json-web-tokens)
