import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadService.create(createLeadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  listAccounts(
    @Query('pageSize', new DefaultValuePipe('10'), ParseIntPipe)
    pageSize: number,
    @Query('pageToken') pageToken: string,
  ) {
    return this.leadService.listLeads(pageSize, pageToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':leadId')
  findOne(@Param('leadId') leadId: string) {
    return this.leadService.getLead(leadId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':leadId')
  update(
    @Param('leadId') leadId: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadService.update(leadId, updateLeadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':leadId')
  @HttpCode(204)
  remove(@Param('leadId') leadId: string) {
    return this.leadService.delete(leadId);
  }
}
