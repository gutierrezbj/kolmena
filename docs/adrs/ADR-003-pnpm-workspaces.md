# ADR-003: pnpm Workspaces para Monorepo

## Status: Accepted

## Context
El monorepo de Kolmena contiene apps/mobile, server/, y packages/shared. Se necesita un package manager con soporte nativo de workspaces.

## Decision
Usar pnpm con pnpm-workspace.yaml.

## Consequences
- **Positivo:** 2-3x más rápido que npm install
- **Positivo:** Content-addressable store ahorra disco (relevante en VPS)
- **Positivo:** Soporte nativo de workspaces maduro y bien documentado
- **Positivo:** Strict mode previene phantom dependencies
- **Negativo:** Un tool más que instalar (vs npm que viene con Node)

## Alternatives Considered
- **npm workspaces:** Incluido con Node pero más lento y sin deduplicación inteligente.
- **yarn workspaces:** Maduro pero yarn 4 (Berry) tiene DX cuestionable y PnP agrega complejidad.
