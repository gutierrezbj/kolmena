# ADR-005: Sin MongoDB en MVP

## Status: Accepted

## Context
El SDD original incluía MongoDB Atlas para datos no estructurados (actas, logs, archivos). En el MVP (Fase 1), no hay módulo de actas ni transcripciones.

## Decision
Usar solo PostgreSQL 16 + Redis 7 en el MVP. PostgreSQL JSONB para datos semi-estructurados (rules_json, audit_log payload, metadata variable). Introducir MongoDB cuando Fase 2-3 lo requiera.

## Consequences
- **Positivo:** Un motor de DB menos = menos complejidad operacional
- **Positivo:** Un solo backup strategy
- **Positivo:** PostgreSQL JSONB cubre 100% de necesidades Fase 1
- **Negativo:** Migración de datos si JSONB no escala para Fase 3 (poco probable)

## Alternatives Considered
- **MongoDB desde día 1:** Como dice el SDD. Descartado porque agrega complejidad sin beneficio en Fase 1.
