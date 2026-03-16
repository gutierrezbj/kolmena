# Kolmena - La Comunidad Inteligente

**Status:** Pre-desarrollo, decisiones arquitectónicas tomadas, scaffolding pendiente
**Repo:** github.com/srs-tech/kolmena (pendiente crear)
**Domain:** kolmena.app (pendiente registrar)
**Document:** Kolmena_SDD_v0.2.0 (en carpeta raíz del proyecto)

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
- **Mobile:** React Native + Expo SDK 52 (iOS + Android + Web)
- **DB:** PostgreSQL 16 (multi-tenancy schema isolation) + Redis 7
- **ORM:** Drizzle ORM
- **Auth:** JWT (15min/7d) + OAuth2 Google + Magic Link
- **Files:** Cloudflare R2
- **IDs:** UUID v7
- **API:** REST + OpenAPI auto-generado desde Zod
- **Infra:** Docker Compose en VPS SRS (8GB RAM, 100GB SSD)
- **CI/CD:** GitHub Actions

## Costos MVP
- Prácticamente 0 EUR/mes usando infra compartida SRS
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
