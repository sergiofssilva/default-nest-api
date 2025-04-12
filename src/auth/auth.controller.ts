import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto, RefreshTokenDto } from './dto';
import { CurrentAccount } from './decorators/current-account.decorator';
import { JwtPayload } from './types/jwt-payload.interface';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentAccount() account: JwtPayload) {
    return this.authService.logout(account.sub);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @CurrentAccount() account: JwtPayload,
  ) {
    const accountId = account.sub;
    return this.authService.refreshTokens(
      accountId,
      refreshTokenDto.refreshToken,
    );
  }
}
