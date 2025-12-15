import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Restaurants } from './Restaurants.entity';
import { SurplusPacks } from './SurplusPacks.entity';

@Entity({ name: 'Branches', schema: 'savier_restaurant' })
export class Branches {
  @PrimaryColumn('uuid')
  Id: string;

  @Column('uuid')
  RestaurantId: string;

  @ManyToOne(() => Restaurants, (restaurant) => restaurant.branches)
  @JoinColumn({ name: 'RestaurantId' })
  Restaurant: Restaurants;

  @Column('uuid')
  AddressId: string;

  @Column('text')
  Name: string;

  @Column('text')
  Phone: string;

  @Column('text')
  OpeningTime: string;

  @Column('text')
  ClosingTime: string;

  @OneToMany(() => SurplusPacks, (pack) => pack.Branch)
  surplusPacks: SurplusPacks[];
}
