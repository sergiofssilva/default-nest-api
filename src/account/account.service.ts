import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { encodePageToken, decodePageToken } from '@/common/page-token';
import { SignUpDto } from '@/auth/dto/signup.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async createAccount(signUpDto: SignUpDto): Promise<Account> {
    const existing = await this.findByEmail(signUpDto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hash = await bcrypt.hash(signUpDto.password, 10);
    const account = this.accountRepository.create({
      email: signUpDto.email,
      password: hash,
      name: signUpDto.name,
    });

    return this.accountRepository.save(account);
  }

  async listAccounts(
    pageSize?: number,
    pageToken?: string,
  ): Promise<{
    values: Account[];
    nextPageToken: string | null;
  }> {
    pageSize = Math.max(1, Math.min(pageSize || 10, 1000));

    const query = this.accountRepository.createQueryBuilder('account');

    if (pageToken) {
      const pageTokenDecode = decodePageToken(pageToken);
      if (pageTokenDecode) {
        query.andWhere(
          '(account.name > :name OR (account.name = :name AND account.accountId > :accountId))',
          {
            accountId: pageTokenDecode.collectionId,
            name: pageTokenDecode.secondAttribute,
          },
        );
      }
    }

    const accounts = await query
      .orderBy('account.name', 'ASC')
      .addOrderBy('account.accountId', 'ASC')
      .take(pageSize + 1)
      .getMany();

    let nextPageToken: string | null = null;

    if (accounts.length > pageSize) {
      const lastItem = accounts[pageSize - 1];
      nextPageToken = encodePageToken({
        collectionId: lastItem.accountId,
        secondAttribute: lastItem.name,
      });
    }

    return {
      values: accounts.slice(0, pageSize),
      nextPageToken,
    };
  }

  async getAccount(accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { accountId },
    });

    if (!account) {
      throw new NotFoundException(`Account ${accountId} not found`);
    }

    return account;
  }

  async update(accountId: string, body: UpdateAccountDto) {
    const accountToUpdate = await this.getAccount(accountId);

    Object.assign(accountToUpdate, body);

    await this.accountRepository.update(
      { accountId: accountToUpdate.accountId },
      accountToUpdate,
    );

    return accountToUpdate;
  }

  async delete(accountId: string): Promise<void> {
    const accountToDelete = await this.getAccount(accountId);
    await this.accountRepository.remove(accountToDelete);
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountRepository.findOneBy({ email });
  }

  async findByAccountId(accountId: string): Promise<Account | null> {
    return this.accountRepository.findOneBy({ accountId });
  }

  async updateRefreshToken(
    accountId: string,
    refreshToken: string | null,
  ): Promise<void> {
    const refreshTokenHash = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;

    await this.accountRepository.update(accountId, { refreshTokenHash });
  }
}
