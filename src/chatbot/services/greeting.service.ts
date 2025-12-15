// This service detects greetings and returns a greeting response.
import { Injectable } from '@nestjs/common';

@Injectable()
export class GreetingService {
  private greetings = [
    'hello', 'hi', 'good morning', 'good afternoon', 'good evening',
    'hola', 'buenos días', 'buenas tardes', 'buenas noches',
    'how are you', 'who are you', 'what are you', 'qué tal', 'cómo estás', 'quién eres', 'qué eres'
  ];

  // Returns true if the question is a greeting.
  isGreeting(question: string): boolean {
    const q = question.toLowerCase();
    return this.greetings.some(g => q.includes(g));
  }

  // Returns a simple greeting response in English or Spanish.
  getGreetingResponse(lang: 'en' | 'es' = 'en'): string {
    if (lang === 'es') {
      return [
        '¡Hola! Puedes consultar productos, categorías, restaurantes, sucursales y packs disponibles.',
        '',
        'Ejemplos de preguntas:',
        '- ¿Qué productos hay disponibles?',
        '- ¿Cuáles son las categorías?',
        '- ¿Dónde están las sucursales?',
        '- ¿Qué packs de comida tienen?',
        '',
        'Pregunta lo que quieras y te responderé con información real de la base de datos.'
      ].join('\n');
    }
    return [
      'Hello! You can ask about products, categories, restaurants, branches, and available packs.',
      '',
      'Example questions:',
      '- What products are available?',
      '- What are the categories?',
      '- Where are the branches?',
      '- What food packs do you have?',
      '',
      'Ask anything and I will answer with real database information.'
    ].join('\n');
  }
}
