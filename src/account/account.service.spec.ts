import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';

describe('AccountService', () => {
  let service: AccountService;
  let accountRepository: jest.Mocked<Partial<Repository<Account>>>;

  beforeEach(async () => {
    accountRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: accountRepository,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
