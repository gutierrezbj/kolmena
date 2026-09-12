# Kolmena

Plataforma de gestion inteligente para comunidades de propietarios en Espana.

## Stack

| Capa | Tecnologia |
|------|-----------|
| Mobile | React Native + Expo SDK 55 |
| Panel admin | React 19 + Vite 6 |
| Backend | Node.js + Fastify + TypeScript |
| ORM | Drizzle ORM |
| DB | PostgreSQL 16 + Redis 7 |
| Auth | JWT (jose) + scrypt |
| Push | Expo Push API (FCM + APNs) |
| Email | Resend |
| Ficheros | Cloudflare R2 (fallback local en dev) |
| Validacion | Zod + OpenAPI auto-generado |
| Testing | Vitest |
| CI/CD | GitHub Actions |

## Estructura

```
kolmena/
  apps/mobile/       # React Native + Expo Router
  apps/admin/        # Panel de administracion (React + Vite)
  server/            # Fastify API (8 modulos)
  packages/shared/   # DTOs y design tokens compartidos
  packages/ui/       # Componentes UI compartidos
  infra/             # Docker Compose (Postgres + Redis) y deploy staging
  docs/adrs/         # Architecture Decision Records
  docs/design/       # Identidad visual
```

## Modulos Backend

| Modulo | Prefijo API | Descripcion |
|--------|------------|-------------|
| auth | `/api/v1/auth` | Login, registro, JWT, refresh tokens |
| core | `/api/v1` | Comunidades, propiedades, usuarios, roles |
| social | `/api/v1/social` | Posts, anuncios, votaciones |
| fix | `/api/v1/fix` | Incidencias, asignacion, kanban |
| spaces | `/api/v1/spaces` | Reservas, espacios, calendario |
| notify | `/api/v1` | Notificaciones push, email, device tokens |
| admin | `/api/v1/admin` | Metricas multi-comunidad para el panel |
| upload | `/api/v1/uploads` | Subida de ficheros a R2 |

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

# 6. Arrancar panel admin (puerto 3080)
pnpm --filter @kolmena/admin dev
```

## Convencion de Puertos

Offset SRS asignado a Kolmena: **+80**. Todos los puertos se publican solo en `127.0.0.1`.

| Puerto | Servicio |
|--------|----------|
| 3080 | Panel admin (Vite) |
| 4080 | API Fastify |
| 6080 | PostgreSQL |
| 6081 | Redis |
| 8081 | Expo Dev Server |

## Tests

```bash
pnpm test           # 58 tests de integracion
pnpm test:coverage  # Con cobertura
```

Requieren Postgres levantado: los tests atacan la base de datos real via
`infra/docker-compose.yml`.

## Docs

- API: http://127.0.0.1:4080/docs (Swagger UI)
- ADRs: `docs/adrs/`

## Licencia

Privado - System Rapid Solutions
