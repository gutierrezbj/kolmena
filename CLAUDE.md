# Memory

## Me
JuanCho, Tech Lead en System Rapid Solutions (SRS). Dueño técnico de Kolmena.

## People
| Who | Role |
|-----|------|
| **JuanCho** | Tech Lead, co-fundador, arquitecto y dev principal |
| **Alex Navarro** | Co-dueño de la idea, co-fundador |
| **Erick Saputo** | Líder de comercialización |
| **Adrián Bracho** | Dev, mano derecha de JuanCho |
→ Full list: memory/glossary.md, profiles: memory/people/

## Terms
| Term | Meaning |
|------|---------|
| SRS | System Rapid Solutions - la empresa |
| Kolmena | Plataforma de gestión inteligente para comunidades de propietarios en España |
| SDD | Software Design Document |
| MVP | Minimum Viable Product - Fase 1 de Kolmena |
| Monolito modular | Arquitectura aprobada: un proceso, módulos separados, extraer a microservicios después |
| Multi-tenancy | Aislamiento por schema de PostgreSQL (un schema por comunidad) |
| ADR | Architecture Decision Record |
→ Full glossary: memory/glossary.md

## Project: Kolmena
| Aspecto | Detalle |
|---------|---------|
| **Qué es** | Plataforma SaaS para comunidades de propietarios en España |
| **Mercado** | 900K comunidades, ~100M EUR/año TAM |
| **Fase actual** | Pre-desarrollo, scaffolding del MVP |
| **Repo** | github.com/srs-tech/kolmena (pendiente crear) |
| **Dominio** | kolmena.app (pendiente registrar) |
→ Details: memory/projects/kolmena.md

## Decisiones Arquitectónicas Aprobadas
| ADR | Decisión | Justificación clave |
|-----|----------|---------------------|
| ADR-001 | **Drizzle** sobre Prisma | Mejor control para multi-tenancy por schema, más ligero (4KB vs 1.8MB), SQL puro auditable |
| ADR-002 | **Fastify** sobre Express | 2-3x más rápido, validación Zod built-in, OpenAPI auto-generado |
| ADR-003 | **pnpm workspaces** | Estándar monorepos TS, rápido, eficiente en disco |
| ADR-004 | **REST + OpenAPI** | Fastify auto-genera docs desde Zod schemas, universal |
| ADR-005 | **Sin MongoDB en MVP** | PostgreSQL JSONB cubre datos semi-estructurados de Fase 1 |
| ADR-006 | **UUID v7** sobre v4 | Time-sortable, mejor rendimiento en índices B-tree |
| ADR-007 | **Monolito modular** | Un proceso Node.js, módulos separados por dominio, extraer a microservicios cuando datos lo justifiquen |

## Stack Técnico MVP
| Capa | Tecnología |
|------|-----------|
| Mobile + Web | React Native + Expo SDK 52 |
| Backend | Node.js + Fastify + TypeScript |
| ORM | Drizzle ORM + drizzle-kit |
| DB transaccional | PostgreSQL 16 (multi-tenancy por schema) |
| Cache + Pub/Sub | Redis 7 |
| File storage | Cloudflare R2 |
| Auth | JWT (15min access / 7d refresh) + OAuth2 Google + Magic Link |
| Push | Firebase Cloud Messaging |
| Email | Resend / Brevo |
| CI/CD | GitHub Actions |
| Infra | Docker + Docker Compose en VPS SRS (8GB RAM) |
| Linting | ESLint + Prettier |
| Testing | Vitest (unit), Supertest (integration), Cypress (E2E) |
| Validación | Zod |
| Logging | Pino con correlation ID |

## Estructura del Monorepo
```
kolmena/
  apps/
    mobile/              # React Native + Expo (iOS, Android, Web)
  server/
    src/
      modules/
        auth/            # Auth, onboarding, JWT, roles
        core/            # Communities, properties, users, roles
        social/          # Wall, posts, announcements, polls
        fix/             # Incidents, providers, kanban
        spaces/          # Reservations, calendar, rules
        notify/          # Push, email, SMS
      shared/
        middleware/       # Auth guard, rate limit, error handler
        errors/          # Typed error codes
        types/           # Shared TypeScript types
        utils/           # UUID v7, helpers
        db/              # Drizzle client, schema, migrations
      config/            # Environment config (Zod validated)
      plugins/           # Fastify plugins (auth, cors, etc.)
      app.ts             # Fastify app, monta todas las rutas
    Dockerfile
  packages/
    shared/              # DTOs, tipos compartidos mobile↔server
    ui/                  # Componentes UI compartidos (futuro)
  infra/                 # Docker Compose, nginx configs
  docs/adrs/             # Architecture Decision Records
```

## Módulos MVP (Fase 1) - Orden de implementación
1. **Auth + Onboarding** (EP-01): QR + magic link + JWT + roles (admin/president/resident/provider)
2. **Core** (base): Communities, properties, users, multi-tenancy setup
3. **Kolmena Social** (EP-02): Wall, posts, announcements, polls, push notifications
4. **Kolmena Fix** (EP-03): Incidents con fotos, kanban, providers, timeline
5. **Kolmena Spaces** (EP-04): Reservas, calendario visual, reglas, conflictos
6. **Panel Admin** (EP-05): Dashboard multi-comunidad, gestión residentes, export CSV

## Patrones Obligatorios
- Repository pattern para acceso a datos (abstracción sobre Drizzle)
- Service layer entre controller y repository
- DTOs con Zod para validación de endpoints
- Error handling centralizado con códigos tipados
- Logging estructurado (Pino) con correlation ID
- Health check en /health
- Rate limiting en API
- CORS por entorno

## Prohibiciones
- NO `any` en TypeScript
- NO `console.log` en producción (usar logger)
- NO queries SQL directas (usar Drizzle)
- NO secrets hardcoded
- NO lógica de negocio en controllers
- NO llamadas síncronas entre módulos (usar eventos Redis cuando sea cross-module)
- NO dependencias sin auditar

## Reglas UX
- Regla de 5 toques: cualquier acción en 5 taps/clicks máximo
- Regla del abuelo: si un +70 no puede usarlo sin ayuda, está mal diseñado
- Zero tutorial: si necesita tutorial, simplificar
- No push spam: solo notificaciones accionables
- Consumer-grade: compite con Instagram, no con SAP

## Preferences
- Respuestas directas, sin rodeos
- Nada de emojis ni tono formal
- Explicaciones prácticas, al grano
- Conventional Commits: feat(social): ..., fix(fix): ...
- Branches: main (prod), develop, feature/US-XXX, fix/bug-description
- PRs: min 1 review
