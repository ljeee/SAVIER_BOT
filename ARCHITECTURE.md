# Arquitectura de SAVIER_BOT

## Estructura principal

```
SAVIER_BOT/
  src/
    app.module.ts         # Módulo raíz
    main.ts               # Bootstrap y configuración global
    cache/                # Lógica de cache e interceptor
    chatbot/              # Lógica del bot, controladores y servicios
    entities/             # Entidades de base de datos
    xdatabase/            # Módulo de conexión a base de datos
  .env                    # Configuración de entorno
  package.json            # Dependencias y scripts
```

## Componentes clave

- **CacheInterceptor:** Interceptor global que cachea respuestas automáticamente.
- **CacheService:** Servicio que gestiona el cache y su TTL.
- **ChatbotController:** Expone los endpoints del bot.
- **ChatbotService:** Lógica principal del bot, integra servicios de lenguaje y base de datos.
- **HuggingFaceService:** Conexión con el modelo de IA.
- **DatabaseContextService:** Construye contexto desde la base de datos.

## Flujo de una petición
1. Llega una petición a `/chatbot/ask`.
2. El `CacheInterceptor` verifica si hay respuesta cacheada.
   - Si existe, responde directo.
   - Si no, pasa al controlador.
3. `ChatbotController` delega a `ChatbotService`.
4. `ChatbotService` puede consultar la base de datos y/o HuggingFace.
5. La respuesta se cachea automáticamente para futuras peticiones iguales.

## Configuración
- Variables en `.env` para DB, HuggingFace y TTL del cache.
- Modularidad para fácil mantenimiento y escalabilidad.
