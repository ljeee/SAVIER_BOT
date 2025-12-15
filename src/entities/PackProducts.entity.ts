import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PackProducts', schema: 'savier_restaurant' })
export class PackProducts {
  @PrimaryColumn('uuid')
  PackId: string;

  @PrimaryColumn('uuid')
  ProductId: string;

  @Column('integer')
  ApproximateQuantity: number;
}
