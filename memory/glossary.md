# Glossary

Workplace shorthand, acronyms, and internal language. Updated 17 Mar 2026.

## Acronyms
| Term | Meaning | Context |
|------|---------|---------|
| SRS | System Rapid Solutions | La empresa madre |
| SDD | Software Development with AI Direction | Metodología SRS: humano dirige, IA ejecuta |
| MVP | Minimum Viable Product | Primera versión funcional |
| ADR | Architecture Decision Record | Decisiones técnicas documentadas |
| KOP | Kickoff Protocol | Protocolo estandarizado de 8 fases para iniciar cualquier proyecto SRS |
| TAM | Total Addressable Market | Mercado total direccionable |
| RBAC | Role-Based Access Control | admin/president/resident/provider/inquiry (Kolmena) |
| FCM | Firebase Cloud Messaging | Push notifications |
| ORM | Object-Relational Mapping | Drizzle (Kolmena), Motor nativo (SA99/CRM) |
| DPA | Data Processing Agreement | Requerido GDPR con proveedores cloud |
| SEPA | Single Euro Payments Area | Integración pagos Kolmena Fase 2 |
| RAG | Retrieval Augmented Generation | Motor de búsqueda semántica SA99 (Qdrant + embeddings) |
| SSE | Server-Sent Events | Streaming de respuestas IA en SA99 y Document Builder |
| V2X | Vehicle-to-Everything | Protocolo Vodafone STEP para Build360/SkyPro |
| MRR | Monthly Recurring Revenue | Ingresos recurrentes mensuales SRS |

## Internal Terms
| Term | Meaning |
|------|---------|
| Manifiesto SDD-SRS | Documento marco v1.2 — principios, estructura y reglas obligatorias para todos los proyectos |
| Kickoff Protocol | Checklist de 8 fases (Fase 0-7) obligatorio para todo proyecto nuevo. Vive en Notion bajo [SRS] - Técnico |
| Catálogo de Infra | Documento maestro infraestructura SRS: dispositivos, puertos, stack, onboarding, seguridad |
| hot cache | CLAUDE.md — memoria rápida que se lee al inicio de cada sesión |
| monolito modular | Arquitectura Kolmena: un proceso Fastify, módulos separados por dominio |
| multi-tenancy | Un schema PostgreSQL por comunidad (Kolmena), shared tables en public |
| schema isolation | Mismo concepto que multi-tenancy en contexto Kolmena |
| port convention | Regla de puertos SRS: 3xxx frontend, 4xxx API, 5xxx internal, 6xxx DB. Offset por proyecto |
| offset | Número de proyecto en la convención de puertos (+0 CRM, +10 Overwatch, etc.) |
| SA-Notebook | Capa de datos propia de SA99, reemplaza Notion como fuente de datos estructurados |
| OpenClaw | Red de satélites distribuidos de SA99 (SA96 Mac, SA97 Windows, VPS SSH) |
| Approval System | Sistema de aprobación de SA99: 4 tiers (auto/notify/approve/confirm), 22 reglas |
| Tool Calling | 8 herramientas ejecutables desde chat SA99 (check_wellbeing, list_ideas, search_people, etc.) |
| Model Router | SDD-11 SA99: enrutamiento inteligente de requests entre LLM local y APIs de pago |
| Spotter | Motor de prospección del CRM SRS (scraping + análisis) |
| Ghost Tech | White-label dispatch de InSiteIQ |
| Site Bible | Base de conocimiento por ubicación en InSiteIQ |
| Fase 0 | Documentación completa (8 SDDs). No se escribe código |
| Fase 1 / MVP | Primera versión funcional según SDD-02 y SDD-05 |
| Fase 2+ | Iteración, nuevas funcionalidades según backlog |

## Kolmena-Specific Terms
| Term | Meaning |
|------|---------|
| Fase 1 / MVP | Auth, Social, Fix, Spaces, Admin Panel |
| Fase 2 | Rent, Parcel, Rules, Accounting, Junta, SEPA |
| Fase 3 | AI (transcripción actas, NLP, semantic search) |
| Fase 4 | IoT (WiFi comunitario, control acceso, sensores) |

## Module Names (Kolmena)
| Nombre | Qué hace |
|--------|----------|
| Kolmena Social | Muro comunidad, posts, anuncios, encuestas |
| Kolmena Fix | Incidencias, proveedores, kanban |
| Kolmena Spaces | Reservas espacios comunes, calendario |
| Kolmena Rent | Marketplace alquiler/venta (Fase 2) |
| Kolmena Parcel | Registro paquetería (Fase 2) |
| Kolmena Rules | Gestión infracciones (Fase 2) |
| Kolmena Junta | Juntas, votaciones, actas (Fase 2) |
| Kolmena AI | Transcripción, NLP, búsqueda semántica (Fase 3) |
| Kolmena IoT | WiFi, control acceso, sensores (Fase 4) |
| Kolmena Pro | Portal proveedores (Fase 2+) |
| Kolmena Board | Dashboard presidente (Fase 2+) |

## Epic Codes (Kolmena)
| Code | Epic |
|------|------|
| EP-01 | Auth + Onboarding |
| EP-02 | Kolmena Social |
| EP-03 | Kolmena Fix |
| EP-04 | Kolmena Spaces |
| EP-05 | Panel Admin |
| EP-06 | Kolmena Core (Accounting) |
| EP-07 | Kolmena Junta |
| EP-08 | Kolmena AI |
| EP-09 | Kolmena IoT |
| EP-10 | Kolmena Pro |
| EP-11 | Kolmena Rent |
| EP-12 | Kolmena Parcel |
| EP-13 | Kolmena Rules |
| EP-14 | Kolmena Board |

## SA99 Agents
| Agent | Type | What it does |
|-------|------|-------------|
| health-checker | cron/5min | Ping endpoints HTTP, verificar servicios |
| assistant | on-demand | Chat conversacional con streaming SSE + Tool Calling |
| email-reader | cron/15min | Fetch IMAP + clasificación LLM + alertas |
| alert-evaluator | cron/30min | Evaluación de patrones, alertas proactivas |
| notification-briefing | cron/5:30 UTC | Briefing diario por email |
| notion-sync | cron/12h | Indexar Notion para RAG |

## Project Codenames
| Name | What |
|------|------|
| SA99 | Clon digital de JuanCho, orquestador de agentes IA |
| SA96 | Satélite Mac Mini (M4 Pro) en red OpenClaw |
| SA97 | Satélite Windows 10 en red OpenClaw |
| SA86 | Concepto: Agente IT por IA (precursor de SA99) |
| Vigía / Castor | Portal interactivo de presas de España |
| Nexus | Proyecto en Apps > Comerciales (pendiente detalle) |

## Nicknames → Full Names
| Nickname | Person |
|----------|--------|
| JuanCho | Juan (Fundador, Tech Lead) |
| Alex | Alex Navarro (co-fundador Kolmena) |
| Erick | Erick Saputo (líder comercial Kolmena) |
| Adrián | Adrián Bracho (dev, mano derecha) |
| Andros | Soporte + Comercial SRS |
| Adriana | Soporte + Licitaciones SRS |
| Christian | Colaborador drones |

## Competitors (Kolmena)
| Name | Type | Weakness vs Kolmena |
|------|------|---------------------|
| Fynkus | Admin software | Solo contabilidad, sin social ni IoT |
| FincasPlus | Admin software | Pasivo para residentes |
| Gesfincas | Admin software | Sin componente social |
| Fincapp | Community app | Sin contabilidad real |
| TusVecinos | Community app | Alternativa WhatsApp sin gestión |
| Comunidad App | Community app | Sin integración admin |
| AppFolio | Enterprise platform | UX pobre, sin social |
| Yardi | Enterprise platform | Sin marketplace ni IoT |

## Competitors (InSiteIQ)
| Name | Coverage | Weakness |
|------|----------|----------|
| Field Nation | USA + Canada | No cubre LATAM ni Europa |
| FieldEngineer | Global (180 países) | Cobertura superficial fuera USA/UK |
| WorkMarket (ADP) | USA | Sin presencia real LATAM |
| Kinettix | LATAM via brokers | Intermediario opaco, no plataforma |
