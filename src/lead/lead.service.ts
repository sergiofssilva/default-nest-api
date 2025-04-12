import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';
import { Repository } from 'typeorm';
import { decodePageToken, encodePageToken } from '@/common/page-token';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    const lead = this.leadRepository.create(createLeadDto);
    return await this.leadRepository.save(lead);
  }

  async listLeads(
    pageSize?: number,
    pageToken?: string,
  ): Promise<{
    values: Lead[];
    nextPageToken: string | null;
  }> {
    pageSize = Math.max(1, Math.min(pageSize || 10, 1000));

    const query = this.leadRepository.createQueryBuilder('lead');

    if (pageToken) {
      const pageTokenDecode = decodePageToken(pageToken);
      if (pageTokenDecode) {
        query.andWhere(
          '(lead.name > :name OR (lead.name = :name AND lead.leadId > :leadId))',
          {
            leadId: pageTokenDecode.collectionId,
            name: pageTokenDecode.secondAttribute,
          },
        );
      }
    }

    const leads = await query
      .orderBy('lead.name', 'ASC')
      .addOrderBy('lead.leadId', 'ASC')
      .take(pageSize + 1)
      .getMany();

    let nextPageToken: string | null = null;

    if (leads.length > pageSize) {
      const lastItem = leads[pageSize - 1];
      nextPageToken = encodePageToken({
        collectionId: lastItem.leadId,
        secondAttribute: lastItem.name,
      });
    }

    return {
      values: leads.slice(0, pageSize),
      nextPageToken,
    };
  }

  async getLead(leadId: string) {
    const lead = await this.leadRepository.findOne({
      where: { leadId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead ${leadId} not found`);
    }

    return lead;
  }

  async update(leadId: string, body: UpdateLeadDto) {
    const leadToUpdate = await this.getLead(leadId);

    Object.assign(leadToUpdate, body);

    await this.leadRepository.update(
      { leadId: leadToUpdate.leadId },
      leadToUpdate,
    );

    return leadToUpdate;
  }

  async delete(leadId: string): Promise<void> {
    const leadToDelete = await this.getLead(leadId);
    await this.leadRepository.remove(leadToDelete);
  }
}
