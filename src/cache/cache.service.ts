import { Injectable } from '@nestjs/common';
import { CacheHistoryEntry } from './cache.types';

@Injectable()
export class CacheService {
  /**
   * Obtener un valor de caché por clave (respuesta directa, no historial)
   */
  get(key: string): string | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    const now = Date.now();
    if (now - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    // Si hay historial, devolver la última respuesta
    if (cached.history.length > 0) {
      const lastEntry: unknown = cached.history[cached.history.length - 1];
      if (
        lastEntry &&
        typeof lastEntry === 'object' &&
        lastEntry !== null &&
        !(lastEntry instanceof Error) &&
        Object.prototype.hasOwnProperty.call(lastEntry, 'answer') &&
        typeof (lastEntry as { answer?: unknown }).answer === 'string'
      ) {
        // Safe to access answer property
        return (lastEntry as CacheHistoryEntry).answer as string;
      }
      // If lastEntry is an Error or does not have answer, return null
      return null;
    }
    return null;
  }

  /**
   * Guardar un valor de caché por clave (respuesta directa, no historial)
   */
  set(key: string, value: string): void {
    const now = Date.now();
    let history: CacheHistoryEntry[] = [];
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (cached && now - cached.timestamp <= this.TTL) {
        history = cached.history;
      }
    }
    // Agregar nueva entrada al historial
    history = [...history, { question: '', answer: value, timestamp: now }];
    if (history.length > this.MAX_HISTORY) {
      history = history.slice(history.length - this.MAX_HISTORY);
    }
    this.cache.set(key, { history, timestamp: now });
    console.log(`💾 [Cache] Guardando respuesta directa: ${key.substring(0, 50)}...`);
  }
  /**
   * El caché ahora guarda historial de preguntas y respuestas por clave
   * Cada clave tiene un array de entradas {question, answer, timestamp}
   */
  private cache: Map<string, { history: CacheHistoryEntry[]; timestamp: number }> = new Map();
  private readonly TTL = 3600000; // 1 hora en milisegundos
  private readonly MAX_CACHE_SIZE = 100; // Máximo de entradas en caché
  private readonly MAX_HISTORY = 10; // Máximo historial por clave

  /**
   * Obtener el historial de preguntas y respuestas para una clave
   * Si no existe o expiró, retorna null
   */
  getHistory(key: string): CacheHistoryEntry[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    const now = Date.now();
    if (now - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      console.log(`🗑️ [Cache] Entrada expirada: ${key.substring(0, 50)}...`);
      return null;
    }
    console.log(`💾 [Cache] HIT (historial): ${key.substring(0, 50)}...`);
    return cached.history;
  }

  /**
   * Agregar una nueva pregunta y respuesta al historial de la clave
   * Si la clave no existe, la crea. Mantiene el historial acotado.
   */
  addToHistory(key: string, question: string, answer: string): void {
    // Si el caché está lleno, eliminar la entrada más antigua
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value as string;
      this.cache.delete(firstKey);
    }
    const now = Date.now();
    let history: CacheHistoryEntry[] = [];
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (cached && now - cached.timestamp <= this.TTL) {
        history = cached.history;
      }
    }
    // Agregar nueva entrada al final
    history = [...history, { question, answer, timestamp: now }];
    // Limitar historial
    if (history.length > this.MAX_HISTORY) {
      history = history.slice(history.length - this.MAX_HISTORY);
    }
    this.cache.set(key, { history, timestamp: now });
    console.log(`💾 [Cache] Guardando en historial: ${key.substring(0, 50)}...`);
  }

  /**
   * Generates a unique cache key based on model and prompt.
   */
  generateKey(model: string, prompt: string): string {
    // Simple hash or concatenation for uniqueness
    return `${model}:${Buffer.from(prompt).toString('base64')}`;
  }

  /**
   * Limpiar todo el caché
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🧹 [Cache] Limpiado completo. ${size} entradas eliminadas.`);
  }

  /**
   * Obtener estadísticas del caché
   */
  getStats() {
    const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
      key: key.substring(0, 100),
      age: Math.floor((Date.now() - value.timestamp) / 1000), // segundos
      historyLength: value.history.length,
      lastQA: value.history.length > 0 ? value.history[value.history.length - 1] : null,
    }));
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      ttlSeconds: this.TTL / 1000,
      entries,
    };
  }

  /**
   * Limpiar entradas expiradas
   */
  cleanExpired(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.TTL) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 [Cache] Limpiadas ${cleaned} entradas expiradas`);
    }

    return cleaned;
  }
}
