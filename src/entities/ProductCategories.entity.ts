import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Products } from './Products.entity';

@Entity({ name: 'ProductCategories', schema: 'savier_restaurant' })
export class ProductCategories {
  @PrimaryColumn('uuid')
  Id: string;

  @Column('text')
  Name: string;

  @OneToMany(() => Products, (product) => product.Category)
  products: Products[];
}
