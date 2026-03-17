# Memory

## Me
JuanCho, fundador y Tech Lead en System Rapid Solutions (SRS). Dueño técnico de todos los proyectos. Madrid, España.

## People
| Who | Role |
|-----|------|
| **JuanCho** | Fundador, Tech Lead, arquitecto y dev principal |
| **Andros** | Soporte + Comercial, operaciones y prospección |
| **Adriana** | Soporte + Licitaciones estado |
| **Christian** | Colaborador puntual drones (incorporación mediano plazo) |
| **Alex Navarro** | Co-fundador Kolmena |
| **Erick Saputo** | Líder comercialización Kolmena |
| **Adrián Bracho** | Dev, mano derecha de JuanCho |
→ Full list: memory/people/

## Terms
| Term | Meaning |
|------|---------|
| SRS | System Rapid Solutions - la empresa |
| SDD | Software Development with AI Direction - metodología SRS |
| Manifiesto SDD-SRS | Documento marco v1.2 - principios, estructura y reglas obligatorias |
| Kickoff Protocol | Checklist de 8 fases (0-7) obligatorio para todo proyecto nuevo |
| Catálogo de Infra | Documento maestro de infraestructura: dispositivos, puertos, stack, onboarding |
| SA99 | Clon digital de JuanCho - orquestador de agentes IA |
| OpenClaw | Red de satélites distribuidos de SA99 (SA96 Mac, SA97 Windows) |
| SA-Notebook | Capa de datos propia de SA99, reemplaza Notion como fuente estructurada |
| Kolmena | Plataforma SaaS para comunidades de propietarios en España |
| MVP | Minimum Viable Product |
| ADR | Architecture Decision Record |
→ Full glossary: memory/glossary.md

## SRS - Líneas de Negocio
- **IT Support:** Soporte técnico internacional, MSPs, licitaciones estado
- **Drones:** Inspección, termografía, topografía. Equipos: Mavic 3E, Mavic 3 Pro, M30T, RTK
- **Software propio:** CRM, SA99, OverWatch, DroneHub, FitoLink, ContractBuilder, Kolmena, etc.
- **MRR actual:** 3,000 EUR + pipeline 29,500 EUR (FCC Aqualia)

## Proyectos Activos (17 Mar 2026)
| Proyecto | Fase | Donde corre | Descripción |
|----------|------|-------------|-------------|
| **SA99** | v2.0 Sprint 12 | PROD (6 containers) | Clon digital, 452+ tests, tool calling, LM Studio en SA96 |
| **CRM SRS** | v6.0 en desarrollo | PROD (3 containers) | CRM gestión comercial con Spotter |
| **OverWatch** | Fase 1 completada | PROD (8 containers) | Copernicus + Drones inspección post-catástrofe |
| **DroneHub SRS** | Fase 1.5 | PROD (2 containers) | Plataforma global ecosistema drones |
| **Vigía** | Comercial activa | PROD (static) | Portal interactivo presas España |
| **FitoLink** | Fase 0 completa | STAGING (3 containers) | Inteligencia agrícola predictiva |
| **Document Builder** | MVP completado | STAGING (1 container) | Fusión docs legales con IA (bufete EEUU) |
| **SkyPro/DroneOps** | Fase 0 | STAGING (3 containers) | Alertas operaciones drones + 5G Vodafone STEP |
| **BodyForge** | Fase 0 completa | Mac Mini (2 containers) | Transformación corporal con IA |
| **Kolmena** | Fase 1 dev activo | Mac Mini (local) | SaaS comunidades propietarios España |
| **Copiloto Ciudadano** | SDD completas | Sin deploy | IA guía administración pública |
| **InSiteIQ** | Conceptualización | Sin deploy | Sistema operativo soporte IT campo global |
| **Build360** | Fase 0 docs | Sin deploy | Alertas obras públicas + Vodafone STEP V2X |
→ Details: memory/projects/

## Infraestructura SRS (Mar 2026)
| Dispositivo | IP Pública | IP Tailscale | Specs | Containers |
|-------------|-----------|--------------|-------|------------|
| VPS PROD | 72.62.41.234 | 100.71.174.77 | 2 vCPU, 8GB RAM, 96GB SSD | 19 |
| VPS STAGING | 187.77.71.102 | 100.110.52.22 | 1 vCPU, 4GB RAM, 50GB NVMe | 9 |
| Mac Mini (bleu) | 5.225.5.105 | 100.107.171.77 | M4 Pro, 24GB RAM | 7 + LM Studio |
| Windows 10 (garage1) | - | 100.102.203.58 | 32GB RAM, 1TB SSD | 0 |

Convención puertos: 3xxx frontend, 4xxx API, 5xxx internal, 6xxx DB. Offset por proyecto (+0 CRM, +10 Overwatch, +20 SA99, +30 DroneHub, +40 FitoLink, +50 SkyPro, +60 ContractBuilder, +70 BodyForge, +80 Kolmena). Siguiente libre: +90.
Coste total: ~22.50 EUR/mes.
→ Details: memory/context/company.md

## Kickoff Protocol (17 Mar 2026)
Protocolo estandarizado de 8 fases obligatorio para todo proyecto SRS nuevo.
Fases: 0-Brainstorming → 1-Setup Notion → 2-SDD completo → 3-Infra reservada → 4-Dev local → 5-Staging → 6-Producción → 7-Documentar y cerrar.
No se salta ninguna fase. No se codifica sin SDD completo. No se deploya sin infra reservada.
Notion: https://www.notion.so/3257981f08ef8191b135d5da2bc759d1
→ Details: memory/context/company.md

## Decisiones Arquitectónicas Kolmena
| ADR | Decisión | Justificación clave |
|-----|----------|---------------------|
| ADR-001 | **Drizzle** sobre Prisma | Mejor control multi-tenancy por schema, más ligero |
| ADR-002 | **Fastify** sobre Express | 2-3x más rápido, validación Zod built-in |
| ADR-003 | **pnpm workspaces** | Estándar monorepos TS |
| ADR-004 | **REST + OpenAPI** | Auto-generado desde Zod schemas |
| ADR-005 | **Sin MongoDB en MVP** | PostgreSQL JSONB cubre Fase 1 |
| ADR-006 | **UUID v7** sobre v4 | Time-sortable, mejor rendimiento B-tree |
| ADR-007 | **Monolito modular** | Un proceso Node.js, módulos separados por dominio |

## Stack Técnico Kolmena MVP
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
| Infra | Docker + Docker Compose en VPS SRS |
| Testing | Vitest (unit), Supertest (integration), Cypress (E2E) |
| Validación | Zod |
| Logging | Pino con correlation ID |

## Estructura del Monorepo Kolmena
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

## Módulos MVP Kolmena (Fase 1) - Orden de implementación
1. **Auth + Onboarding** (EP-01): QR + magic link + JWT + roles
2. **Core** (base): Communities, properties, users, multi-tenancy setup
3. **Kolmena Social** (EP-02): Wall, posts, announcements, polls
4. **Kolmena Fix** (EP-03): Incidencias con fotos, kanban, providers
5. **Kolmena Spaces** (EP-04): Reservas, calendario visual, reglas
6. **Panel Admin** (EP-05): Dashboard multi-comunidad, gestión, CSV

## Patrones Obligatorios Kolmena
- Repository pattern para acceso a datos (abstracción sobre Drizzle)
- Service layer entre controller y repository
- DTOs con Zod para validación de endpoints
- Error handling centralizado con códigos tipados
- Logging estructurado (Pino) con correlation ID
- Health check en /health
- Rate limiting en API
- CORS por entorno

## Prohibiciones Kolmena
- NO `any` en TypeScript
- NO `console.log` en producción (usar logger)
- NO queries SQL directas (usar Drizzle)
- NO secrets hardcoded
- NO lógica de negocio en controllers
- NO llamadas síncronas entre módulos (usar eventos Redis)
- NO dependencias sin auditar

## Reglas UX Kolmena
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
