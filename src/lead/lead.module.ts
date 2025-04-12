import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { Lead } from './entities/lead.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Lead])],
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadModule {}
