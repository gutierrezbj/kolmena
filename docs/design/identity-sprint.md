# Kolmena — Identity Sprint v1.0
Ejecutado: Abril 2026 | Responsable: JuanCho
Metodología: SRS Design System Nucleus v2.0

---

## Paso 1 — Frase de carácter

> **"Gestoría de nueva generación para la escalera de toda la vida"**

Tensión deliberada entre lo profesional/moderno y lo cercano/comunitario.
La app es seria pero no fría. Organizada pero no corporativa. Tecnológica pero no clínica.

**Referencia no-digital:** Packaging artesanal japonés (Muji, ceramistas oaxaqueños),
señalización urbana vintage española — cálido, orgánico, pero ordenado.

---

## Paso 2 — Temperatura de color

**Cálida.** Ancla: honey `#F5A623` — conservado de la identidad original.

| Token | Hex | Uso |
|-------|-----|-----|
| `honey[500]` | `#F5A623` | Primary, CTAs, accents |
| `warm[50]` | `#FFFDF7` | Fondo principal — blanco cálido, no puro |
| `warm[800]` | `#3D2E1E` | Texto principal |
| `warm[900]` | `#1C1410` | Near-black cálido, hero sections |
| `toast[500]` | `#7C5E3C` | Acento secundario — referencia panal |

**Regla 60-30-10:**
- 60%: `warm[50]` y `warm[100]` — fondos y superficies
- 30%: `warm[800]` y `warm[600]` — texto e iconos
- 10%: `honey[500]` — acciones, enlaces, foco

---

## Paso 3 — Tipografía

**Pareja: Bricolage Grotesque + Plus Jakarta Sans + DM Mono**

| Fuente | Rol | Por qué |
|--------|-----|---------|
| **Bricolage Grotesque** | Display / headers | Grotesca variable con carácter propio. Enérgica, no genérica. Inusual en apps de gestión — crea tensión |
| **Plus Jakarta Sans** | Body / texto corriente | Humanista legible, no Inter/Roboto, calibrada para pantalla |
| **DM Mono** | Datos, fechas, IDs, badges | Crea contraste legible con Bricolage. Dice "datos precisos" |

**Verificación contra Blacklist:**
- Bricolage Grotesque: NO está en la lista ✓
- Plus Jakarta Sans: NO está en la lista ✓
- DM Mono: NO está en la lista ✓
- Roboto: eliminado del admin ✓
- Inter: nunca usado ✓

---

## Paso 4 — Signature Motion

**Curva primaria: `ease-spring`**
```
cubic-bezier(0.22, 1.2, 0.36, 1)
```

**Patrón: Spring Lift**
Todos los elementos interactivos (cards, botones, nav links) responden con:
```css
hover: translateY(-3px) scale(1.01)
active: scale(0.97)
transition: 280ms ease-spring
```

**Duraciones SRS Foundation aplicadas:**
- `instant` (100ms): cambios de color, opacity
- `fast` (180ms): hover states, focus rings
- `normal` (280ms): cards, dropdowns, panels

---

## Paso 5 — Signature Detail

**Micro-textura hexagonal** — referencia directa al concepto colmena.

```
SVG hexagonal grid, fill: #F5A623, opacity: 4%
Aplicado en: Login background, Sidebar admin
```

Se repite en toda la app como elemento reconocible. A 4% de opacity
es sutil pero está ahí — quien lo ve, lo recuerda.

---

## Paso 6 — Template Test ✓

La combinación **Bricolage Grotesque + `#FFFDF7` + honey + textura hexagonal**
no aparece en ningún starter kit conocido (Shadcn, Tailwind UI, Vercel, etc.).

Al mostrar el diseño a alguien externo: "¿esto se parece a algo?" → No.

---

## Distinctiveness Audit

- [x] Fuentes elegidas NO están en la Blacklist
- [x] Color primario NO es default de Tailwind/Bootstrap/Material
- [x] Fondo tiene personalidad: `#FFFDF7` (no `#FFFFFF`, `#000000`, `#111827`)
- [x] Signature detail: textura hexagonal repetida en toda la app
- [x] Curva de easing primaria elegida y documentada (`ease-spring`)
- [x] Motion: Spring Lift aplicado consistentemente en cards y botones
- [x] Combinación tipográfica crea tensión (grotesca display + mono datos)
- [x] Todos los spacing/z-index/duration vienen de SRS Foundation
- [x] Template Test superado

---

## Implementación

| Archivo | Contenido |
|---------|-----------|
| `packages/shared/src/design/foundation.ts` | SRS Foundation tokens inmutables |
| `packages/shared/src/design/theme-kolmena.ts` | Paleta + typo + motion Kolmena |
| `apps/admin/src/theme/tokens.ts` | Tokens admin (web) |
| `apps/admin/src/theme/fonts.css` | @import Google Fonts + Fontshare |
| `apps/mobile/src/theme/colors.ts` | Warm palette mobile |
| `apps/mobile/src/theme/typography.ts` | Bricolage + Jakarta + DM Mono |
| `apps/mobile/src/theme/spacing.ts` | SRS Foundation spacing scale |
| `apps/mobile/src/lib/fonts.ts` | expo-font loader |
