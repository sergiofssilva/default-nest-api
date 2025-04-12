import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AccountService } from '@/account/account.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '@/config/jwt.config';
import { ConfigType } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  const mockAccountService = {
    findByEmail: jest.fn(),
    updateRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AccountService, useValue: mockAccountService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: jwtConfig.KEY,
          useValue: {
            access: {
              secret: 'test_access_secret',
              expiresIn: '15m',
            },
            refresh: {
              secret: 'test_refresh_secret',
              expiresIn: '7d',
            },
          } as ConfigType<typeof jwtConfig>,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
