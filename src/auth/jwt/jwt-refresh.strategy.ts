import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload.interface';
import { RefreshTokenDto } from '../dto';
import jwtConfig from '@/config/jwt.config';
import { ConfigType } from '@nestjs/config';

interface RequestWithRefreshToken extends Request {
  body: RefreshTokenDto;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtSettings: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: jwtSettings.refresh.secret,
      passReqToCallback: true,
    } as {
      jwtFromRequest: (req: Request) => string | null;
      secretOrKey: string;
    });
  }

  validate(req: RequestWithRefreshToken, payload: JwtPayload) {
    const refreshToken = req.body.refreshToken;
    return {
      ...payload,
      refreshToken,
    };
  }
}
