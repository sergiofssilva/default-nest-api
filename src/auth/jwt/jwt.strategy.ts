import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.interface';
import jwtConfig from '@/config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtSettings: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSettings.access.secret,
    } as {
      jwtFromRequest: (req: Request) => string | null;
      secretOrKey: string;
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
