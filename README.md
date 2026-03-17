# Kolmena

Plataforma de gestion inteligente para comunidades de propietarios en Espana.

## Stack

| Capa | Tecnologia |
|------|-----------|
| Mobile + Web | React Native + Expo SDK 55 |
| Backend | Node.js + Fastify + TypeScript |
| ORM | Drizzle ORM |
| DB | PostgreSQL 16 + Redis 7 |
| Auth | JWT (jose) + bcrypt |
| Validacion | Zod + OpenAPI auto-generado |
| Testing | Vitest |
| CI/CD | GitHub Actions |

## Estructura

```
kolmena/
  apps/mobile/       # React Native + Expo Router
  server/            # Fastify API (6 modulos)
  packages/shared/   # DTOs compartidos
  infra/             # Docker Compose (Postgres + Redis)
  docs/adrs/         # Architecture Decision Records
```

## Modulos Backend

| Modulo | Prefijo API | Descripcion |
|--------|------------|-------------|
| auth | `/api/v1/auth` | Login, registro, JWT, refresh tokens |
| core | `/api/v1` | Comunidades, propiedades, usuarios, roles |
| social | `/api/v1/social` | Posts, anuncios, votaciones |
| fix | `/api/v1/fix` | Incidencias, asignacion, kanban |
| spaces | `/api/v1/spaces` | Reservas, espacios, calendario |
| notify | `/api/v1` | Notificaciones push, email, preferencias |

## Setup Local

```bash
# 1. Levantar infraestructura
docker compose -f infra/docker-compose.yml up -d

# 2. Instalar dependencias
pnpm install

# 3. Aplicar schema a la base de datos
pnpm db:push

# 4. Arrancar servidor (puerto 4080)
pnpm dev

# 5. Arrancar mobile
cd apps/mobile && npx expo start
```

## Convencion de Puertos

| Puerto | Servicio |
|--------|----------|
| 4080 | API Fastify |
| 6080 | PostgreSQL |
| 6081 | Redis |
| 8081 | Expo Dev Server |

## Tests

```bash
pnpm test           # 42 tests de integracion
pnpm test:coverage  # Con cobertura
```

## Docs

- API: http://127.0.0.1:4080/docs (Swagger UI)
- ADRs: `docs/adrs/`

## Licencia

Privado - System Rapid Solutions
