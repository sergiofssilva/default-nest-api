import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  listAccounts(
    @Query('pageSize', new DefaultValuePipe('10'), ParseIntPipe)
    pageSize: number,
    @Query('pageToken') pageToken: string,
  ) {
    return this.accountService.listAccounts(pageSize, pageToken);
  }

  @Get(':accountId')
  findOne(@Param('accountId') accountId: string) {
    return this.accountService.getAccount(accountId);
  }

  @Patch(':accountId')
  update(
    @Param('accountId') accountId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.update(accountId, updateAccountDto);
  }

  @Delete(':accountId')
  @HttpCode(204)
  remove(@Param('accountId') accountId: string) {
    return this.accountService.delete(accountId);
  }
}
