# ADR-001: Drizzle ORM sobre Prisma

## Status: Accepted

## Context
Kolmena necesita un ORM TypeScript para PostgreSQL con soporte robusto para multi-tenancy por schema isolation. El SDD original mencionaba Prisma o Drizzle como opciones.

## Decision
Usar Drizzle ORM con drizzle-kit para migraciones.

## Consequences
- **Positivo:** Control fino sobre queries, esencial para `SET search_path` y queries cross-schema en multi-tenancy
- **Positivo:** Runtime ligero (~4KB vs ~1.8MB Prisma engine), relevante en VPS 8GB
- **Positivo:** Migraciones generan SQL puro auditable
- **Positivo:** Type-safe con SQL-like syntax natural
- **Negativo:** Menos documentación y comunidad que Prisma
- **Negativo:** Menos ecosistema de plugins

## Alternatives Considered
- **Prisma:** Más maduro, mejor DX para CRUD simple. Descartado porque abstrae demasiado el multi-tenancy por schema y el engine en runtime es pesado.
- **Kysely:** Buen query builder type-safe, pero sin migraciones integradas ni schema declaration.
