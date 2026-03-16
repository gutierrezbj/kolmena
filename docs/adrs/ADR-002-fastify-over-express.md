# ADR-002: Fastify sobre Express

## Status: Accepted

## Context
El SDD original especificaba Express. Se reevaluó para un proyecto nuevo en 2026.

## Decision
Usar Fastify como framework HTTP del backend.

## Consequences
- **Positivo:** 2-3x mejor rendimiento que Express
- **Positivo:** Validación de schemas built-in (conecta con Zod via fastify-type-provider-zod)
- **Positivo:** Auto-generación de OpenAPI/Swagger desde schemas
- **Positivo:** Mejor soporte TypeScript nativo
- **Positivo:** Sistema de plugins encapsulado (ideal para módulos del monolito)
- **Negativo:** Menos middleware de terceros disponible (vs Express ecosystem)
- **Negativo:** API ligeramente diferente a Express, curva de aprendizaje mínima

## Alternatives Considered
- **Express:** Estándar del SDD original. Descartado por falta de validación nativa, TypeScript por decoradores, y rendimiento inferior.
- **Hono:** Ultra-ligero, excelente para edge. Descartado porque Kolmena necesita un servidor completo con plugins, no edge functions.
