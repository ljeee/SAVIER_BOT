import { Controller, Post, Body, Get, Delete, Query } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotResponseDto } from './dto/chatbot-response.dto';
import { CacheService } from '../cache/cache.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly cacheService: CacheService,
  ) {}

  @Post('ask')
  async ask(@Body('question') question: string): Promise<ChatbotResponseDto | { error: string }> {
    if (!question) return { error: 'Pregunta requerida' };
    try {
      let answer = await this.chatbotService.askGrok(question);
      // Limpiar IDs del texto (patrón: (ID: ...))
      answer = answer
        .replace(/\(ID: [^)]+\)/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\n\s*\n/g, '\n');
      // Formatear decimales a máximo 2 dígitos
      answer = answer.replace(/(\d+\.\d{2})\d+/g, '$1');
      return new ChatbotResponseDto(question, answer.trim());
    } catch {
      return { error: 'Error procesando la pregunta' };
    }
  }
  @Get('cache/history')
  getCacheHistory(@Query('key') key: string) {
    if (!key) {
      return { error: 'Clave de caché requerida' };
    }
    const history = this.cacheService.getHistory(key);
    return { key, history };
  }
  @Get('cache/value')
  getCacheValue(@Query('key') key: string) {
    if (!key) {
      return { error: 'Clave de caché requerida' };
    }
    const value = this.cacheService.get(key);
    return { key, value };
  }

  @Delete('cache/clear')
  clearCache() {
    this.cacheService.clear();
    return { message: 'Caché limpiada' };
  }
}
