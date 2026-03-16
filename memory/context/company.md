# Company Context - System Rapid Solutions (SRS)

## About
System Rapid Solutions es la empresa madre. Kolmena es un producto interno de SRS.

## Infrastructure
| Recurso | Detalle |
|---------|---------|
| VPS compartido | KVM 8GB RAM, 100GB SSD |
| GitHub org | srs-tech |
| CI/CD | GitHub Actions |
| DNS/CDN | Cloudflare |
| File storage | Cloudflare R2 |

## Tools
| Tool | Used for |
|------|----------|
| GitHub | Repositorios, CI/CD, PRs |
| Docker | Contenedores, despliegue |
| Claude Cowork | Decisiones, organización, documentación |
| Claude Code | Implementación, coding |

## Processes
| Process | What it means |
|---------|---------------|
| Conventional Commits | feat(module): ..., fix(module): ... |
| Branch strategy | main (prod), develop (integration), feature/US-XXX |
| PR review | Min 1 review o self-review documentado |
| Deploy | GitHub Actions → Docker → VPS via SSH |
