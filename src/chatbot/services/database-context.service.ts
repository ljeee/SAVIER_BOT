// This service builds the database context for the chatbot.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from '../../entities/Products.entity';
import { ProductCategories } from '../../entities/ProductCategories.entity';
import { Restaurants } from '../../entities/Restaurants.entity';
import { Branches } from '../../entities/Branches.entity';
import { SurplusPacks } from '../../entities/SurplusPacks.entity';

@Injectable()
export class DatabaseContextService {
  constructor(
    @InjectRepository(Products) private productsRepo: Repository<Products>,
    @InjectRepository(ProductCategories) private categoriesRepo: Repository<ProductCategories>,
    @InjectRepository(Restaurants) private restaurantsRepo: Repository<Restaurants>,
    @InjectRepository(Branches) private branchesRepo: Repository<Branches>,
    @InjectRepository(SurplusPacks) private surplusPacksRepo: Repository<SurplusPacks>,
  ) {}

  // Returns a string with database context.
  async getContext(): Promise<string> {
    const [products, categories, restaurants, branches, surplusPacks] = await Promise.all([
      this.productsRepo.find({ take: 10, order: { Id: 'DESC' } }),
      this.categoriesRepo.find({ take: 10, order: { Id: 'DESC' } }),
      this.restaurantsRepo.find({ take: 5, order: { Id: 'DESC' } }),
      this.branchesRepo.find({ take: 5, order: { Id: 'DESC' } }),
      this.surplusPacksRepo.find({ take: 10, order: { Id: 'DESC' }, relations: ['Branch', 'Branch.Restaurant'] }),
    ]);
    const context: string[] = [];
    if (products.length > 0) {
      context.push('Some available products:');
      products.forEach((p) => {
        context.push(`• ${p.Name}: $${p.OriginalPrice} - ${p.Description || 'No description'}`);
      });
      context.push('');
    }
    if (categories.length > 0) {
      context.push('Product categories:');
      categories.forEach((c) => {
        context.push(`• ${c.Name}`);
      });
      context.push('');
    }
    if (restaurants.length > 0) {
      context.push('Featured restaurants:');
      restaurants.forEach((r) => {
        context.push(`• ${r.CommercialName} - Type: ${r.CuisineType} - Rating: ${r.AverageRating}⭐`);
      });
      context.push('');
    }
    if (branches.length > 0) {
      context.push('Some branches:');
      branches.forEach((b) => {
        context.push(`• ${b.Name} - Phone: ${b.Phone} - Hours: ${b.OpeningTime} to ${b.ClosingTime}`);
      });
      context.push('');
    }
    if (surplusPacks.length > 0) {
      context.push('Available food packs:');
      surplusPacks.forEach((pack) => {
        const restaurantName = pack.Branch?.Restaurant?.CommercialName || 'Unknown restaurant';
        const branchName = pack.Branch?.Name || 'Unknown branch';
        context.push(`• ${pack.Name} - ${pack.Description || 'No description'} - Price: $${pack.OfferPrice} (was $${pack.OriginalPrice})`);
        context.push(`  Stock: ${pack.Stock} | Restaurant: ${restaurantName} | Branch: ${branchName}`);
        context.push(`  Pickup: ${pack.PickupStartTime} - ${pack.PickupEndTime}`);
        context.push(`  Status: ${pack.Status === 'active' ? 'Available' : 'Not available'} | Type: ${pack.PackType}`);
      });
      context.push('');
    }
    context.push('Summary:');
    context.push(`Products: ${products.length} | Categories: ${categories.length} | Restaurants: ${restaurants.length} | Branches: ${branches.length} | Packs: ${surplusPacks.length}`);
    return context.join('\n');
  }
}
