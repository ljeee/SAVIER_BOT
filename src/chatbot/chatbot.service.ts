import { Injectable } from '@nestjs/common';
import { HuggingFaceService } from './services/huggingface.service';
import { DatabaseContextService } from './services/database-context.service';
import { GreetingService } from './services/greeting.service';
import { LanguageService } from './services/language.service';

@Injectable()
export class ChatbotService {
  // Injects the helper services.
  constructor(
    private huggingFaceService: HuggingFaceService,
    private dbContextService: DatabaseContextService,
    private greetingService: GreetingService,
    private languageService: LanguageService,
  ) {}

  // Main method: answers a question using greetings, context, and Hugging Face.
  async askGrok(question: string): Promise<string> {
    console.log('\n' + '='.repeat(60));
    console.log('[CHATBOT] Nueva pregunta recibida');
    console.log('Pregunta:', question);
    console.log('='.repeat(60) + '\n');

    const q = question.toLowerCase().trim();
    // Detect language.
    const lang = this.languageService.detectLanguage(q);
    // Check if the question is a greeting.
    if (this.greetingService.isGreeting(q) && q.length < 50) {
      return this.greetingService.getGreetingResponse();
    }

    // Get database context.
    const dbContext = await this.dbContextService.getContext();
    try {
      // Build the prompt for Hugging Face in the detected language.
      let systemPrompt = '';
      if (lang === 'es') {
        systemPrompt = [
          'Te llamas Savier bot. Eres un asistente virtual para restaurantes y packs de comida.',
          'Tu objetivo es ayudar a los usuarios a encontrar información sobre productos, categorías, restaurantes, sucursales y packs disponibles.',
          'Tienes acceso a información real de la base de datos.',
          '',
          'IMPORTANTE:',
          '- Usa solo la información proporcionada en el contexto',
          '- Si falta información, dilo',
          '- Responde de forma clara y concisa',
          '- Incluye detalles como precios y nombres cuando sea relevante',
          '- Para listados, muestra los datos reales',
          '',
          '=== DATOS DE LA BASE DE DATOS ===',
          dbContext,
          '=== FIN DE DATOS ===',
          '',
          `Pregunta del usuario: ${question}`,
          '',
          'Responde usando solo los datos anteriores:',
        ].join('\n');
      } else {
        systemPrompt = [
          'Your name is Savier bot. You are a virtual assistant for restaurants and food packs.',
          'Your goal is to help users find information about products, categories, restaurants, branches, and available packs.',
          'You have access to real database information.',
          '',
          'IMPORTANT:',
          '- Use only the information provided in the context',
          '- If information is missing, say so',
          '- Answer clearly and concisely',
          '- Include details like prices and names when relevant',
          '- For lists, show real data',
          '',
          '=== DATABASE DATA ===',
          dbContext,
          '=== END OF DATA ===',
          '',
          `User question: ${question}`,
          '',
          'Answer using only the data above:',
        ].join('\n');
      }
      // Get answer from Hugging Face.
      const llmAnswer = await this.huggingFaceService.generate(systemPrompt);
      return lang === 'es' ? `Respuesta generada por IA:\n\n${llmAnswer}` : `AI generated answer:\n\n${llmAnswer}`;
    } catch (err: any) {
      // Fallback: show database data directly.
      return this.getFallbackResponse(dbContext);
    }
  }

  // Returns a fallback response with database data.
  private getFallbackResponse(dbContext: string): string {
    return [
      'Información de la base de datos:',
      '',
      'IA no disponible. Mostrando datos directos de la base de datos:',
      '',
      dbContext,
      '',
      'Tip: Asegúrate de que tu API key de Hugging Face esté configurada correctamente.',
    ].join('\n');
  }
}
