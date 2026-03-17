# Kolmena - La Comunidad Inteligente

**Status:** Fase 1 en desarrollo activo — backend completo (6 módulos), mobile conectado al API
**Repo:** github.com/gutierrezbj/kolmena
**Domain:** kolmena.app (pendiente registrar)
**Infra:** Offset +80 (puertos 3080/4080/5080/6080-6081). Mac Mini: postgres + redis ya corriendo
**Document:** Kolmena_SDD_v0.2.0 (en carpeta raíz del proyecto)
**Notion:** https://www.notion.so/3247981f08ef81c9a487df3e07b62fab

## Qué Es
Plataforma SaaS de gestión inteligente para comunidades de propietarios en España. Integra administración, social, incidencias, reservas, marketplace inmobiliario e IoT en una sola app.

## Problema
España tiene ~900K comunidades de propietarios gestionadas con WhatsApp, Excel y papel. Administradores gestionan 50-200 comunidades con herramientas fragmentadas. Residentes sin visibilidad financiera ni participación digital.

## Mercado
- TAM España: ~100M EUR/año
- SaaS: ~54M EUR/año
- Comisiones alquiler: ~17M EUR/año
- Comisiones venta: ~18M EUR/año
- Hardware IoT: variable

## Revenue Model
- SaaS por comunidad (3-8 EUR/comunidad/mes según tier)
- Comisión en transacciones alquiler/venta
- Hardware IoT (one-time + mantenimiento)

## Key People
- **JuanCho** - Tech Lead, arquitecto, dev principal
- **Alex Navarro** - Co-fundador, idea original
- **Erick Saputo** - Comercialización
- **Adrián Bracho** - Dev, mano derecha de JuanCho

## Progreso Actual (17 Mar 2026)

### Backend (server/) — COMPLETO
- 6 módulos implementados: auth, core, social, fix, spaces, notify
- Schema Drizzle completo: 14 tablas, 8 pgEnums
- 42 tests de integración pasando (Vitest)
- API REST con Zod validation + OpenAPI auto-generado
- CI/CD con GitHub Actions (typecheck + tests con Postgres)
- Auth: JWT (jose), bcrypt, refresh tokens, authGuard middleware

### Mobile (apps/mobile/) — EN PROGRESO
- Expo SDK 55 + Expo Router (tab navigation, 5 tabs)
- Auth flow: login/register con SecureStore para tokens
- Auth guard: verifica sesión almacenada antes de rutear
- 4 screens conectados al API: Home, Social, Fix, Spaces
- 3 formularios de creación: create-incident, create-booking, create-post
- FABs en las 3 tabs principales para crear recursos
- Profile screen con logout
- Theme system: colors + typography tokens
- Hooks: useAuth, useCommunity
- Typecheck limpio (tsc --noEmit exit 0)

### Pendiente Fase 1
- [ ] Panel Admin (EP-05): Dashboard multi-comunidad, gestión, CSV
- [ ] Fotos en incidencias (Cloudflare R2)
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Email transaccional (Resend / Brevo)
- [ ] OAuth2 Google + Magic Link
- [ ] Deploy a staging

## Roadmap
| Fase | Módulos | Timeline estimado |
|------|---------|-------------------|
| **Fase 1 (MVP)** | Auth, Social, Fix, Spaces, Admin Panel | Mes 1-4 |
| **Beta** | 3-5 comunidades reales | Mes 4-6 |
| **Fase 2** | Rent, Parcel, Rules, Accounting, Junta | Mes 6-10 |
| **Fase 3** | AI (transcripción, NLP, semantic search) | Mes 10-14 |
| **Fase 4** | IoT (WiFi, control acceso, sensores) | Mes 14+ |

## Métricas de Éxito MVP
| Métrica | Target | Cuándo |
|---------|--------|--------|
| Comunidades en beta | 3-5 | Mes 4 |
| Residentes activos/semana | >40% registrados | Mes 6 |
| Incidencias resueltas por app | >80% sin llamadas | Mes 6 |
| NPS administradores | >50 | Mes 6 |
| Reservas por app vs manual | >60% por app | Mes 6 |
| Retención admin mensual | >90% | Mes 8 |

## Arquitectura (Decisiones Aprobadas)
- **Patrón:** Monolito modular (un proceso Fastify, módulos por dominio)
- **Backend:** Node.js + Fastify + TypeScript
- **Mobile:** React Native + Expo SDK 55 (iOS + Android + Web)
- **DB:** PostgreSQL 16 (multi-tenancy schema isolation) + Redis 7
- **ORM:** Drizzle ORM
- **Auth:** JWT (15min/7d) + OAuth2 Google + Magic Link
- **Files:** Cloudflare R2
- **IDs:** UUID v7
- **API:** REST + OpenAPI auto-generado desde Zod
- **Infra:** Docker Compose en VPS SRS (8GB RAM, 96GB SSD). Offset +80 en convención puertos
- **CI/CD:** GitHub Actions

## Costos MVP
- ~0 EUR/mes usando infra compartida SRS (~22.50 EUR/mes total SRS)
- Dominio: ~15 EUR/año
- Apple Developer: 99 EUR/año
- Google Play: 25 EUR one-time

## Competidores Principales
- Software admin: Fynkus, FincasPlus, Gesfincas (solo contabilidad)
- Apps comunidad: Fincapp, TusVecinos (solo comunicación)
- Enterprise: AppFolio, Yardi (UX pobre, sin social/IoT)
- **Diferenciación Kolmena:** único que integra admin + social + marketplace + IoT

## Roles de Usuario
| Rol | Permisos |
|-----|----------|
| admin | Gestión completa multi-comunidad |
| president | Dashboard comunidad, aprobaciones, anuncios oficiales |
| resident | Wall, incidencias, reservas, votos |
| provider | Ver incidencias asignadas, actualizar estado |
| inquiry | Solo lectura (interesados en compra/alquiler) |

## DB Schema Highlights
- `public` schema: users, communities, subscriptions (compartido)
- `community_{id}` schema: datos específicos de cada comunidad
- Tablas principales: communities, properties, users, user_properties, posts, incidents, spaces, bookings, providers, audit_log
- audit_log inmutable para event sourcing

## Límites Técnicos MVP
- Max 500 comunidades simultáneas en VPS inicial
- Max 50 propiedades por comunidad en tier FREE
- Sin integración bancaria directa
- Sin procesamiento de pagos
- Sin IoT
- Sin videoconferencia integrada
- Sin soporte offline completo
- Solo español inicialmente
