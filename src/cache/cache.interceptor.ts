import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly ttl: number;

  constructor(private readonly cacheService: CacheService) {
    // TTL en segundos, configurable por variable de entorno o valor por defecto (ej: 300s = 5min)
    this.ttl = parseInt(process.env.CACHE_TTL || '300', 10);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = this.generateCacheKey(request);

    const cached = this.cacheService.get(key);
    if (cached) {
      return of(JSON.parse(cached));
    }

    return next.handle().pipe(
      tap((response) => {
        this.cacheService.set(key, JSON.stringify(response), this.ttl);
      }),
    );
  }

  private generateCacheKey(request: any): string {
    // Personaliza la clave según tus necesidades
    return `${request.method}:${request.url}:${JSON.stringify(request.body)}`;
  }
}
