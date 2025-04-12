import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import jwtConfig from './jwt.config';
import dbConfig from './db.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [jwtConfig, dbConfig],
      validationSchema: Joi.object({
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
        DATABASE_URL: Joi.string().uri().required(),
      }),
    }),
  ],
})
export class GlobalConfigModule {}
