import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '@/account/account.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '@/config/jwt.config';

@Module({
  imports: [
    forwardRef(() => AccountModule),
    JwtModule.register({}),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    JwtRefreshGuard,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
