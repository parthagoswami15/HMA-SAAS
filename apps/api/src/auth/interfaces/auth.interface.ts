import { Role } from '@prisma/client';

export interface TokenPayload {
  sub: string;        // User ID
  email: string;      // User email
  role: Role;         // User role
  tenantId?: string;  // Optional tenant ID for multi-tenancy
  jti?: string;       // JWT ID (for token invalidation)
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface AuthUser {
  id: string;
  sub: string;        // Alias for id to match TokenPayload
  email: string;
  role: string;
  tenantId?: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  jti?: string;       // For token invalidation
}
