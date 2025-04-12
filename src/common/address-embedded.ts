import { Column } from 'typeorm';

export class Address {
  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  region?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  cep?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  complement?: string;

  @Column({ nullable: true })
  reference?: string;
}
