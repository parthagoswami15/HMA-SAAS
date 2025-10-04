import { Role } from '@prisma/client';

export interface JwtPayload {
  // Standard JWT claims
  sub: string; // Subject (user ID)
  jti: string; // JWT ID (unique identifier for the token)
  iat: number; // Issued at
  exp: number; // Expiration time
  
  // Custom claims
  email: string;
  role: Role;
  tenantId: string;
  
  // Optional claims
  [key: string]: any; // Allow for additional custom claims
}

export interface RequestWithUser extends Request {
  user: JwtPayload & {
    // Additional user properties added during request processing
    permissions?: string[];
  };
}
