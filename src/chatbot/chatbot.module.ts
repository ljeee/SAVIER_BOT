import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../entities/Products.entity';
import { ProductCategories } from '../entities/ProductCategories.entity';
import { Restaurants } from '../entities/Restaurants.entity';
import { Branches } from '../entities/Branches.entity';
import { SurplusPacks } from '../entities/SurplusPacks.entity';
import { PackProducts } from '../entities/PackProducts.entity';
import { CacheService } from '../cache/cache.service';
import { HuggingFaceService } from './services/huggingface.service';
import { DatabaseContextService } from './services/database-context.service';
import { GreetingService } from './services/greeting.service';
import { LanguageService } from './services/language.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Products,
      ProductCategories,
      Restaurants,
      Branches,
      SurplusPacks,
      PackProducts,
    ]),
  ],
  controllers: [ChatbotController],
  providers: [
    ChatbotService,
    CacheService,
    HuggingFaceService,
    DatabaseContextService,
    GreetingService,
    LanguageService,
  ],
})
export class ChatbotModule {}
