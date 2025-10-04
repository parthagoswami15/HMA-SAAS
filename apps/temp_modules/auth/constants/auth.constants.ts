/**
 * Authentication-related constants
 */

export const TENANT_ID_HEADER = 'x-tenant-id';
export const AUTH_HEADER = 'authorization';
export const BEARER_PREFIX = 'Bearer ';

// Token expiration times
export const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
export const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// Cache keys
export const TOKEN_BLACKLIST_PREFIX = 'token:blacklist:';
export const USER_TOKENS_PREFIX = 'user:tokens:';

// Rate limiting
// Max login attempts before account is locked
export const MAX_LOGIN_ATTEMPTS = 5;
// Lockout time in minutes
export const ACCOUNT_LOCKOUT_MINUTES = 15;
