# SAVIER_BOT

## Getting Started

1. **Clona el repositorio:**
   ```bash
   git clone <repo-url>
   cd SAVIER_BOT
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Configura el archivo `.env`:**
   - Edita `.env` con tus credenciales y parámetros (ver ejemplo incluido).

4. **Inicia el bot:**
   ```bash
   npm run start
   ```

5. **Prueba el endpoint principal:**
   ```bash
   curl -X POST http://localhost:3000/chatbot/ask -H "Content-Type: application/json" -d "{\"question\": \"Hola, ¿quién eres?\"}"
   ```

---

## Endpoints principales
- `POST /chatbot/ask` — Pregunta al bot.
- `GET /chatbot/cache/history` — Consulta historial de cache.
- `GET /chatbot/cache/value` — Consulta valor cacheado.

---

## Notas
- El cache es automático y configurable por TTL en `.env`.
- El bot usa HuggingFace y una base de datos PostgreSQL.

## Jeferson Escudero Rua :b