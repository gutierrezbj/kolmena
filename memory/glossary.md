# Glossary

Workplace shorthand, acronyms, and internal language for Kolmena.

## Acronyms
| Term | Meaning | Context |
|------|---------|---------|
| SRS | System Rapid Solutions | La empresa madre |
| SDD | Software Design Document | Documento principal de diseño (v0.2.0) |
| MVP | Minimum Viable Product | Fase 1 de Kolmena |
| ADR | Architecture Decision Record | Decisiones técnicas documentadas |
| TAM | Total Addressable Market | ~100M EUR/año en España |
| RBAC | Role-Based Access Control | admin/president/resident/provider/inquiry |
| FCM | Firebase Cloud Messaging | Push notifications |
| ORM | Object-Relational Mapping | Drizzle para Kolmena |
| DPA | Data Processing Agreement | Requerido GDPR con proveedores cloud |
| SEPA | Single Euro Payments Area | Integración pagos Fase 2 |

## Internal Terms
| Term | Meaning |
|------|---------|
| monolito modular | Arquitectura aprobada: un proceso Fastify, módulos separados por dominio |
| multi-tenancy | Un schema PostgreSQL por comunidad, shared tables en public |
| schema isolation | Mismo concepto que multi-tenancy en contexto Kolmena |
| hot cache | CLAUDE.md - memoria rápida |
| Fase 1 / MVP | Auth, Social, Fix, Spaces, Admin Panel |
| Fase 2 | Rent, Parcel, Rules, Accounting, Junta, SEPA |
| Fase 3 | AI (transcripción actas, NLP, semantic search) |
| Fase 4 | IoT (WiFi comunitario, control acceso, sensores) |

## Module Names
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

## Epic Codes
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

## Nicknames → Full Names
| Nickname | Person |
|----------|--------|
| JuanCho | Juan (Tech Lead, co-fundador) |
| Alex | Alex Navarro (co-dueño idea) |
| Erick | Erick Saputo (líder comercial) |
| Adrián | Adrián Bracho (dev, mano derecha) |

## Competitors
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
