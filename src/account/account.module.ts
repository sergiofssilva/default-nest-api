import { forwardRef, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), forwardRef(() => AuthModule)],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
