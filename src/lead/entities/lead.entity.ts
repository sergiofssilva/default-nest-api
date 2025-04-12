import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Address } from '@/common/address-embedded';

@Entity()
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  leadId: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column(() => Address)
  address?: Address;
}
