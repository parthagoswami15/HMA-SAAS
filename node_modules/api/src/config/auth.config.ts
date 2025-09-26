import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m', // 15 minutes
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d', // 7 days
    },
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },
  refreshToken: {
    cookieName: 'refreshToken',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  },
  rateLimit: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10), // 1 minute
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10), // requests per IP
  },
}));
