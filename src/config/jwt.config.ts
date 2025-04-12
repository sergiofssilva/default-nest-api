import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  access: {
    secret: process.env.JWT_ACCESS_SECRET ?? 'dev-secret-access',
    expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET ?? 'dev-secret-refresh',
    expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
}));
