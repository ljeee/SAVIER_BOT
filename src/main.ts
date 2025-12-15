import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CacheInterceptor } from './cache/cache.interceptor';
import { CacheService } from './cache/cache.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const cacheService = app.get(CacheService);
  app.useGlobalInterceptors(new CacheInterceptor(cacheService));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
