# ADR-007: Monolito Modular sobre Microservicios

## Status: Accepted

## Context
El SDD v0.2.0 define 11 microservicios lógicos. El equipo de desarrollo es de 2 personas (JuanCho + Adrián). Se reevaluó la arquitectura considerando el equipo disponible.

## Decision
Arrancar con un monolito modular: un solo proceso Node.js/Fastify con módulos separados por dominio (auth, core, social, fix, spaces, notify). Extraer a microservicios cuando los datos de carga lo justifiquen.

## Consequences
- **Positivo:** Scaffolding en días vs semanas
- **Positivo:** Un solo Dockerfile, un solo deploy, un solo lugar para debuggear
- **Positivo:** Sin overhead de red entre módulos (llamadas a función directas)
- **Positivo:** La separación lógica se mantiene; extraer un módulo es refactor de horas
- **Positivo:** Adecuado para el tamaño del equipo (2 devs)
- **Negativo:** No se puede escalar módulos independientemente (por ahora)
- **Negativo:** Un crash afecta todo el sistema (mitigable con process managers)

## Migration Path
1. Monolito modular (Fase 1-2): un proceso, módulos desacoplados
2. Extraer svc-ai como servicio independiente (Fase 3): Python/FastAPI, runtime diferente
3. Evaluar extracción de otros módulos si métricas lo justifican (>500 comunidades)
4. Migrar a microservicios completos si el equipo crece y la carga lo requiere

## Alternatives Considered
- **Microservicios desde día 1:** Como dice el SDD. Descartado por overhead operacional desproporcionado para un equipo de 2.
- **Serverless (Cloud Functions/Lambda):** Cold starts inaceptables para real-time, vendor lock-in, difícil debugging local.
