# Company Context - System Rapid Solutions (SRS)

Última actualización: 17 Marzo 2026

## About
System Rapid Solutions (SRS) — Madrid, España. Empresa de servicios IT, drones profesionales y desarrollo de software propio. Fundada y dirigida por JuanCho.

Dos líneas de negocio activas: soporte IT internacional (MSPs, licitaciones estado, clientes directos) y servicios de drones profesionales (inspección, termografía, topografía). Además, desarrolla productos software propios (CRM, SA99, OverWatch, DroneHub, etc.).

## Team
| Who | Role | Responsibilities |
|-----|------|-----------------|
| JuanCho | Dirección + Tech Lead | Estrategia, desarrollo negocio, arquitectura, dev principal |
| Andros | Soporte + Comercial | Operaciones, atención clientes, prospección |
| Adriana | Soporte + Licitaciones | Operaciones, búsqueda licitaciones estado |
| Christian | Colaborador puntual | Prospección drones (incorporación mediano plazo) |
| Alex Navarro | Co-fundador Kolmena | Co-dueño de la idea |
| Erick Saputo | Comercialización Kolmena | Líder comercial |
| Adrián Bracho | Dev | Mano derecha de JuanCho |

## Business Lines
### IT Support
- Soporte técnico internacional (LATAM, Centroamérica, Europa)
- MSPs y licitaciones estado
- MRR actual: 3,000 EUR
- Pipeline: FCC Aqualia 29,500 EUR/mes, Devsavant (adjudicado verbal), AYESA (licitación)

### Drones
- Inspección, termografía, topografía
- Equipos: Mavic 3E, Mavic 3 Pro, M30T, Antena RTK
- Alianzas: Dronvinci, Agroxdron, Skypro 360
- Clientes: Inetum (cursos), 100x100 Drones (proyectos)

### Software Propio
13+ proyectos en distintas fases, desde producción hasta conceptualización. Ver sección Proyectos.

## Infrastructure (Mar 2026)

### Dispositivos
| Dispositivo | Hostname | IP Pública | IP Tailscale | SO | Specs | Containers |
|-------------|----------|-----------|--------------|-----|-------|------------|
| VPS PROD | srs-prod | 72.62.41.234 | 100.71.174.77 | Ubuntu 24.04 | 2 vCPU, 8GB RAM, 96GB SSD | 19 |
| VPS STAGING | srs-staging | 187.77.71.102 | 100.110.52.22 | Ubuntu 22.04 | 1 vCPU, 4GB RAM, 50GB NVMe | 9 |
| Mac Mini | bleu | 5.225.5.105 | 100.107.171.77 | macOS 26.3 | M4 Pro, 24GB RAM, 460GB SSD | 7 + LM Studio |
| Windows 10 | garage1 | - | 100.102.203.58 | Windows 10 | ASUS Zephyrus, 32GB RAM, 1TB SSD | 0 |

Todos conectados via Tailscale (mesh WireGuard, configurado 12 Mar 2026).

### Port Convention
- 3xxx: Frontends/Dashboards
- 4xxx: APIs/Backends
- 5xxx: Servicios internos (workers, fetchers)
- 6xxx: Bases de datos y almacenamiento
- SIEMPRE `127.0.0.1:PUERTO:INTERNO` (nunca `0.0.0.0`)

| Proyecto | Offset | Frontend | API | Internal | DB |
|----------|--------|----------|-----|----------|-----|
| CRM | +0 | 3000 | 4000 | 5000 | 6000-6001 |
| Overwatch | +10 | 3010 | 4010 | 5010 | 6010-6013 |
| SA99 | +20 | 3020 | 4020 | 5020 | 6020-6023 |
| DroneHub | +30 | 3030 | 4030 | - | - |
| FitoLink | +40 | 3040 | 4040 | - | 6040 |
| SkyPro | +50 | 3050 | 4050 | 5050 | - |
| ContractBuilder | +60 | 3060 | - | - | - |
| BodyForge | +70 | 3070 | 4070 | - | 6070 |
| Kolmena | +80 | 3080 | 4080 | 5080 | 6080-6081 |
| **(Siguiente libre)** | **+90** | 3090 | 4090 | 5090 | 6090 |

### Stack Tecnológico Aprobado
- **Frontend:** React 18+, Next.js 16+, Vite 7+, Tailwind CSS
- **Backend:** FastAPI (Python) o Node.js (Express/Fastify)
- **DB:** MongoDB 7+ (principal), PostgreSQL 16 (Kolmena), Redis 7+ (cache/colas)
- **Vector DB:** Qdrant 1.12+ (SA99 RAG)
- **IA:** Anthropic Claude, OpenAI, Google Gemini, LM Studio local (Qwen3-8B/14B)
- **Infra:** Docker + Compose, Nginx reverse proxy, Certbot SSL, Tailscale VPN
- **Security:** UFW (22/80/443), fail2ban, SSH key-only

### LM Studio (Mac Mini - SA96)
- CLI: lms (llmster 0.0.6-1)
- API: OpenAI-compatible en localhost:1234 / Tailscale 100.107.171.77:1234
- Modelos: Qwen3-8B (4.6GB, L0 fast), Qwen3-14B (8.3GB, L1 smart), Nomic Embed v1.5 (84MB)
- Limitación: 1 modelo LLM activo a la vez (24GB compartida)

### Monitoring y Alertas
- healthcheck.sh: cada 5 min, 19 containers PROD + 9 STAGING
- backup-mongo.sh: diario 03:00 UTC
- docker_cleanup.sh: domingos 03:00 UTC
- Alertas via Telegram Bot SA99 (chat 6262984444)

### Costes
~22.50 EUR/mes total (VPS PROD ~10€, STAGING 4.99€, backups ~5.50€, Atlas 0€, Tailscale 0€, SSL 0€)

## Processes
| Process | What it means |
|---------|---------------|
| Manifiesto SDD-SRS v1.2 | Marco de trabajo: documentación antes que código, humano dirige, IA ejecuta |
| Kickoff Protocol | 8 fases obligatorias para todo proyecto nuevo (brainstorming → producción) |
| Conventional Commits | feat(module): ..., fix(module): ... |
| Branch strategy | main (prod), develop (integration), feature/US-XXX |
| PR review | Min 1 review o self-review documentado |
| Deploy | Docker Compose → VPS via SSH. Mac → STAGING → PROD |
| Port Convention | Offset por proyecto, siempre 127.0.0.1 |

### Kickoff Protocol (17 Mar 2026)
Protocolo de inicio estandarizado que vive en Notion bajo [SRS] - Técnico.
Todo proyecto nuevo DEBE seguir estas 8 fases en orden, sin saltarse ninguna:

| Fase | Nombre | Objetivo |
|------|--------|----------|
| 0 | Ideación y Brainstorming | Validar idea, GO/NO-GO |
| 1 | Setup en Notion | Página + 8 SDDs + subcarpetas |
| 2 | Documentación SDD | 8 secciones completas antes de codificar |
| 3 | Reserva de Infraestructura | Puertos, dominio, actualizar Catálogo |
| 4 | Desarrollo Local | MVP en Mac Mini siguiendo SDD |
| 5 | Deploy Staging | Validar fuera de local |
| 6 | Deploy Producción | Nginx + SSL + DNS + monitoring |
| 7 | Documentar y Cerrar | Actualizar Catálogo + Manifiesto |

Notion: https://www.notion.so/3257981f08ef8191b135d5da2bc759d1

### Manifiesto SDD-SRS v1.2
- 5 principios: documentación antes que código, humano mantiene criterio, contexto explícito, iteración controlada, trazabilidad completa
- 8 secciones SDD obligatorias (SDD-01 a SDD-08)
- 4 subcarpetas estándar: Documentación, Diseño, Desarrollo, Recursos
- Fases: 0 (docs) → 1 (MVP) → 2+ (iteración)
- Ciclo de vida: SDD v1 rígido, evolución via ADRs
Notion: https://www.notion.so/2f67981f08ef81649634eb77d65a0c48

## Proyectos (17 Mar 2026)

### En Producción (PROD 72.62.41.234)
| Proyecto | Estado | Containers | Dominio | Stack |
|----------|--------|-----------|---------|-------|
| CRM SRS v6.0 | En desarrollo | 3 (frontend, backend, spotter) | crm.systemrapid.io | React + FastAPI |
| OverWatch | Fase 1 completada (MVP feb 2026) | 8 | overwatch.systemrapid.io | Next.js + FastAPI + Celery + MongoDB + Redis + MinIO |
| SA99 v2.0 | Sprint 12 en curso | 6 (cerebro, dashboard, telegram-bot, mongo, redis, qdrant) | sa99.systemrapid.io | FastAPI + React 19 + MongoDB + Redis + Qdrant |
| DroneHub SRS | Fase 1.5 (MVP completado) | 2 | dronehubsrs.com | React (Vite) + Node.js |
| Vigía | Comercial activa | static | castor.systemrapidsolutions.com | Static site |

### En Staging (187.77.71.102)
| Proyecto | Estado | Containers | Stack |
|----------|--------|-----------|-------|
| FitoLink | Fase 0 completa | 3 (web, api, mongo) | React 19 (Vite) + Express 5 + MongoDB |
| DroneHub (mirror) | Testing | 2 | React (Vite) + Node.js |
| SkyPro/DroneOps | Fase 0 | 3 (frontend, backend, fake-step) | Nginx + FastAPI + Mock API |
| Document Builder | MVP completado | 1 | Next.js 16 + Vercel AI SDK + Docker |

### En Mac Mini (bleu)
| Proyecto | Estado | Containers |
|----------|--------|-----------|
| SkyPro/DroneOps | Dev | 3 |
| BodyForge | Fase 0 completa | 2 (mongo) |
| Kolmena | Pre-desarrollo | 2 (postgres, redis) |

### Sin Deploy (documentación/concepto)
| Proyecto | Fase | Descripción |
|----------|------|-------------|
| Copiloto Ciudadano | SDD completas, listo para código | IA conversacional guía administración pública |
| InSiteIQ | Conceptualización | Sistema operativo soporte IT campo global |
| Build360 | Fase 0 documentación | Alertas obras públicas + Vodafone STEP V2X |
| OpenClaw | Documentado | Red de satélites distribuidos de SA99 (ahora integrado) |

### Side Projects (Apps > Personales)
OttoAI, BARETO, NAVEGANTE — proyectos personales en distintas fases.

## Notion Structure
```
Apps/
  Personales/
    OttoAI, BARETO, NAVEGANTE, OpenClaw, SA99, BodyForge, SA-Notebook
  Comerciales/
    SA86, DroneHub, Vigía, Nexus, SKYPRO360_Alerts, OverWatch, FitoLink,
    Copiloto Ciudadano, Document Builder, InSiteIQ, Build360, Kolmena,
    Propuestas Decide Madrid 2026
[SRS] - Hub Central/
  Pipeline, equipo, alianzas, métricas, Tracker Semanal, Presupuestos, Propuestas
[SRS] - Técnico/
  Manifiesto SDD-SRS, Catálogo de Infraestructura, Checklist de Kickoff,
  Infraestructura DevOps, Configuraciones VPS
```

## Tools
| Tool | Used for |
|------|----------|
| GitHub (srs-tech) | Repositorios, CI/CD, PRs |
| Docker + Compose | Contenedores, todo el despliegue |
| Notion | Documentación, SDDs, proyectos, pipeline comercial |
| Claude Cowork | Decisiones, organización, documentación, brainstorming |
| Claude Code | Implementación, coding |
| CRM SRS | Gestión comercial propia (crm.systemrapid.io) |
| Telegram Bot SA99 | Alertas infra, healthcheck, briefing diario |
| LM Studio | Inferencia local IA en Mac Mini |
| Tailscale | VPN mesh privada entre todos los dispositivos |
