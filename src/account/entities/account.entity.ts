import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from '@/common/address-embedded';
import { AbstractBaseEntity } from '@/common/entities/abstract-base.entity';

@Entity()
export class Account extends AbstractBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  accountId: string;

  @Column()
  name: string;

  @Column({ nullable: true, unique: true })
  nickname?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('text', { nullable: true })
  refreshTokenHash: string | null;

  @Column(() => Address)
  address?: Address;
}
