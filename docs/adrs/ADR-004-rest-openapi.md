# ADR-004: REST + OpenAPI Auto-generado

## Status: Accepted

## Context
Se evaluaron REST, GraphQL, tRPC y gRPC para la API de Kolmena.

## Decision
REST con versionado por URL (/api/v1/) y documentación OpenAPI auto-generada desde Zod schemas via Fastify.

## Consequences
- **Positivo:** Universal, cualquier cliente puede consumir la API
- **Positivo:** Documentación viva generada automáticamente
- **Positivo:** Validación automática de request/response desde Zod
- **Positivo:** Cacheable por HTTP standards
- **Negativo:** Over-fetching en algunos endpoints complejos (mitigable con ?fields=)

## Alternatives Considered
- **tRPC:** Type-safe end-to-end pero limita a clientes TypeScript. Si Kolmena abre API pública o tiene integraciones futuras, tRPC es limitante.
- **GraphQL:** Resuelve over-fetching pero agrega complejidad significativa (resolvers, N+1, caching). Innecesario para el MVP.
- **gRPC:** Excelente para service-to-service pero no para browser/mobile clients sin proxy.
