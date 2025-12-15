import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductCategories } from './ProductCategories.entity';
import { Restaurants } from './Restaurants.entity';

@Entity({ name: 'Products', schema: 'savier_restaurant' })
export class Products {
  @PrimaryColumn('uuid')
  Id: string;

  @Column('uuid')
  CategoryId: string;

  @ManyToOne(() => ProductCategories, (category) => category.products)
  @JoinColumn({ name: 'CategoryId' })
  Category: ProductCategories;

  @Column('text')
  Name: string;

  @Column('text')
  Description: string;

  @Column('numeric')
  OriginalPrice: number;

  @Column('text')
  Status: string;

  @Column('uuid', { default: "'00000000-0000-0000-0000-000000000000'" })
  RestaurantId: string;

  @ManyToOne(() => Restaurants, (restaurant) => restaurant.products)
  @JoinColumn({ name: 'RestaurantId' })
  Restaurant: Restaurants;
}
