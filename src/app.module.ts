import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './xdatabase/database.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, ChatbotModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
