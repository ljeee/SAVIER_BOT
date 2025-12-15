import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Branches } from './Branches.entity';

@Entity({ name: 'SurplusPacks', schema: 'savier_restaurant' })
export class SurplusPacks {
  @PrimaryColumn('uuid')
  Id: string;

  @Column('uuid')
  BranchId: string;

  @ManyToOne(() => Branches, (branch) => branch.surplusPacks)
  @JoinColumn({ name: 'BranchId' })
  Branch: Branches;

  @Column('text')
  Name: string;

  @Column('text')
  Description: string;

  @Column('numeric')
  OriginalPrice: number;

  @Column('numeric')
  OfferPrice: number;

  @Column('integer')
  Stock: number;

  @Column('timestamptz')
  AvailableDate: Date;

  @Column('text')
  PickupStartTime: string;

  @Column('text')
  PickupEndTime: string;

  @Column('text')
  Status: string;

  @Column('text')
  PackType: string;
}
