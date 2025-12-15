  // This service detects the language of a text (English or Spanish).
import { Injectable } from '@nestjs/common';

@Injectable()
export class LanguageService {
  // Returns 'en' for English, 'es' for Spanish, or 'en' by default.
  detectLanguage(text: string): 'en' | 'es' {
    const lower = text.toLowerCase();
    // Simple keyword-based detection
    const spanishWords = ['qué', 'cómo', 'dónde', 'cuál', 'hola', 'buenos', 'tienes', 'hay', 'precio', 'restaurante', 'sucursal', 'packs', 'disponible', 'categoría', 'producto'];
    const englishWords = ['what', 'how', 'where', 'which', 'hello', 'good', 'do you have', 'is there', 'price', 'restaurant', 'branch', 'packs', 'available', 'category', 'product'];
    let esCount = 0;
    let enCount = 0;
    for (const w of spanishWords) if (lower.includes(w)) esCount++;
    for (const w of englishWords) if (lower.includes(w)) enCount++;
    if (esCount > enCount) return 'es';
    if (enCount > esCount) return 'en';
    // Fallback: check for common Spanish characters
    if (/[áéíóúñ¿¡]/.test(lower)) return 'es';
    return 'en';
  }
}
