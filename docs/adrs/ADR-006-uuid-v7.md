# ADR-006: UUID v7 sobre UUID v4

## Status: Accepted

## Context
Kolmena necesita IDs únicos para todas las entidades. UUID v4 es el estándar habitual.

## Decision
Usar UUID v7 para todos los IDs primarios.

## Consequences
- **Positivo:** Time-sortable (ms timestamp embebido), inserciones siempre al final del índice B-tree
- **Positivo:** Mejor rendimiento en PostgreSQL para tablas de alto crecimiento (posts, incidents, bookings)
- **Positivo:** Ordenable cronológicamente sin campo extra created_at en queries simples
- **Positivo:** Compatible con columnas UUID de PostgreSQL
- **Negativo:** Requiere librería (uuidv7) o implementación custom

## Alternatives Considered
- **UUID v4:** Random, fragmenta índices B-tree en tablas grandes. Descartado por rendimiento.
- **ULID:** Similar a UUID v7 pero no es estándar RFC. Descartado por compatibilidad.
- **Auto-increment:** Expone conteo de registros, no distribuible. Descartado por seguridad y escalabilidad.
