import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadService } from './lead.service';
import { Lead } from './entities/lead.entity';

describe('LeadService', () => {
  let service: LeadService;
  let leadRepository: jest.Mocked<Partial<Repository<Lead>>>;

  beforeEach(async () => {
    leadRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadService,
        {
          provide: getRepositoryToken(Lead),
          useValue: leadRepository,
        },
      ],
    }).compile();

    service = module.get<LeadService>(LeadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
