import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { Account } from './account/entities/account.entity';
import { LeadModule } from './lead/lead.module';
import { Lead } from './lead/entities/lead.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { GlobalConfigModule } from './config/global-config.module';

@Module({
  imports: [
    GlobalConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('database.url'),
        entities: [Account, Lead],
        synchronize: true,
      }),
    }),
    AuthModule,
    AccountModule,
    LeadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
