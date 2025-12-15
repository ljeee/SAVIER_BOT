import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Products } from './Products.entity';
import { Branches } from './Branches.entity';

@Entity({ name: 'Restaurants', schema: 'savier_restaurant' })
export class Restaurants {
  @PrimaryColumn('uuid')
  Id: string;

  @Column('uuid')
  OwnerId: string;

  @Column('text')
  CommercialName: string;

  @Column('text')
  Description: string;

  @Column('text')
  CuisineType: string;

  @Column('double precision')
  AverageRating: number;

  @Column('text')
  Status: string;

  @OneToMany(() => Products, (product) => product.Restaurant)
  products: Products[];

  @OneToMany(() => Branches, (branch) => branch.Restaurant)
  branches: Branches[];
}
