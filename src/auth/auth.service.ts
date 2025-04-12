import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcrypt';
import { AccountService } from '@/account/account.service';
import { AuthTokens } from '@/common/auth-tokens';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '@/config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtSettings: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthTokens> {
    const account = await this.accountService.createAccount(signUpDto);

    const tokens = await this.signTokens(account.accountId);
    await this.accountService.updateRefreshToken(
      account.accountId,
      tokens.refreshToken,
    );

    return tokens;
  }

  async signIn(loginDto: LoginDto): Promise<AuthTokens> {
    const account = await this.accountService.findByEmail(loginDto.email);
    if (!account) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      account.password,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.signTokens(account.accountId);
    await this.accountService.updateRefreshToken(
      account.accountId,
      tokens.refreshToken,
    );

    return tokens;
  }

  async refreshTokens(
    accountId: string,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const account = await this.accountService.findByAccountId(accountId);
    if (!account || !account.refreshTokenHash)
      throw new ForbiddenException('Access Denied');

    const isValid = await bcrypt.compare(
      refreshToken,
      account.refreshTokenHash,
    );
    if (!isValid) throw new ForbiddenException('Invalid token');

    const tokens = await this.signTokens(accountId);
    await this.accountService.updateRefreshToken(
      accountId,
      tokens.refreshToken,
    );

    return tokens;
  }

  async logout(accountId: string): Promise<void> {
    await this.accountService.updateRefreshToken(accountId, null);
  }

  private async signTokens(accountId: string): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: accountId }, this.jwtSettings.access),
      this.jwtService.signAsync({ sub: accountId }, this.jwtSettings.refresh),
    ]);

    return { accessToken, refreshToken };
  }
}
