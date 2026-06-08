
# Sprint Final RDM Digital LTOS — Presentación Municipal

Mañana es la demo. Tienes 5 créditos. Este plan está optimizado para entregar **una plataforma funcional, sólida y presentable** en la menor cantidad de turnos posibles, ejecutando TODO dentro de Lovable (sin migrar a Vercel/Next.js 15).

---

## Decisión de arquitectura (clave)

**Mantenemos Lovable + React/Vite + Lovable Cloud (Supabase).** La visión LTOS del blueprint (Next.js 15, Vercel, Istio, Kubernetes, Terraform) es post-MVP. Para la demo municipal lo que importa es:

- Que **funcione en vivo** sin caerse.
- Que se **vea soberano y elegante** (ya está).
- Que los **datos sean reales** (no mocks visibles).
- Que el **Control Center muestre health real**.
- Que la narrativa "Orgullosamente Realmontenses" cierre cada pantalla.

Los repos/ZIPs externos NO se absorben literalmente (riesgo de romper todo a 24h de la demo). En su lugar: **extraigo conceptos, esquemas y rutas faltantes** y los re-implemento limpios sobre la base actual.

---

## Lo que se hace (en un solo turno de build)

### 1. Ruta del Paste con datos reales desde Supabase
- Nueva tabla `paste_pois` (nombre, descripción, lat/lng, coordenadas SVG x/y, orden, rating promedio, fotos).
- Tabla `paste_ratings` (user_id, poi_id, score 1-5, reseña).
- Seed con los 6 puntos actuales del SVG.
- Hook `usePasteRoute()` que carga POIs + agrega ratings dinámicos.
- `RutaDelPasteSVG.tsx` renderiza desde Supabase (no hardcoded), con badges de rating en vivo y modal para puntuar (solo usuarios autenticados).

### 2. Control Center → Telemetría real estilo Grafana/Prometheus
- En lugar de instalar Prometheus (imposible en Lovable), construyo un **mini-Grafana nativo**:
  - Nueva tabla `federation_health_log` que persiste cada snapshot del edge function `federation-health` (histórico 24h).
  - Edge function `federation-health` ahora también escribe en esa tabla en cada llamada.
  - Edge function nueva `alerts-engine`: lee la tabla, evalúa umbrales (latencia > 500ms, integrity < 0.7, offline > 0) y genera alertas en tabla `system_alerts`.
  - En `ControlCenter.tsx`: agrego **sparklines reales** por federación (últimas 30 lecturas) y panel de **alertas activas** con severidad.
  - Umbrales configurables en código (constants), exportables.

### 3. Hardening web producción
- **Frontend:**
  - `index.html`: meta CSP estricta (script-src self + lovable CDN, connect-src supabase + lovable), HSTS hint, referrer-policy, X-Frame-Options sim vía meta, permissions-policy.
  - Inputs sanitizados en formularios (RegistrarComercio, ratings, comentarios) con Zod.
  - CSRF: Supabase ya usa JWT bearer (no cookies), por lo que CSRF clásico no aplica; documento esto en `SECURITY.md`.
- **Backend (edge functions):**
  - Helper `withSecurity()` reutilizable: valida origen, rate-limit por IP en memoria (60 req/min), valida JWT cuando aplica, headers CORS estrictos (no `*` cuando hay credenciales).
  - Aplicado a: `ingest-event`, `metrics-aggregates`, `federation-health`, `alerts-engine`, `chat`, `create-commerce-checkout`, `create-premium-checkout`.
- **DB:** revisión rápida de RLS en tablas nuevas; grants explícitos.

### 4. Absorción "lógica" de la visión LTOS (no copia de repos)
De los Tomos del blueprint y de los 2 .docx adjuntos, integro los **módulos viables en Lovable**:
- `/wiki` — RDMLAWIKI: página nueva tipo enciclopedia editorial con secciones de Historia, Leyendas, Personajes, Minería, Cornish heritage. Datos seed en tabla `wiki_articles`.
- `/ltos` — Manifiesto LTOS Territorial: landing soberana explicando los 7 ejes (Identidad, Ledger, Edge, Nexus, Neural, Media, Twin 4D) con el cálculo I_TAMV.
- Ajustes en `FloatingNav` para incluir Wiki y LTOS.

### 5. Pulido visual final demo-ready
- `DedicationBand` actualizado con efecto shimmer platino.
- Página `Index` (home): hero con KPIs reales en vivo (places, businesses, eventos, tracks) leídos desde Supabase.
- Loading states elegantes (skeleton dorado) en todas las páginas con fetch.
- Favicon + meta tags (og:title, og:description, twitter:card) para que se vea bien cuando lo compartan.

### 6. Pre-vuelo de despliegue
- Verifico build sin errores TS.
- Confirmo edge functions desplegadas.
- Smoke check de health endpoint.
- Aviso final con checklist de demo (URL, credenciales test, recorrido sugerido).

---

## Lo que NO se hace (y por qué)

| Pedido | Por qué no | Alternativa |
|---|---|---|
| Migrar a Next.js 15 / Vercel | Refactor de 3-5 días, rompe demo | Lovable hosting (mismo dominio público) |
| Instalar Grafana/Prometheus reales | Lovable no corre infra K8s | Mini-dashboard nativo con sparklines + alertas en DB |
| Absorber 5+ repos ZIP literalmente | Conflictos de schema y design system irresolubles en 1 turno | Extraer conceptos y re-implementar sobre base actual |
| CSRF tokens clásicos | Stack es JWT bearer, no cookies — no aplica | Documentado en SECURITY.md |
| Rate-limit de infraestructura | No hay primitiva en Lovable backend | Rate-limit ad-hoc en memoria por edge function (aceptado riesgo) |

---

## Detalle técnico

```text
NUEVO
├── supabase/migrations/<ts>_paste_wiki_alerts.sql
│   ├── paste_pois, paste_ratings
│   ├── wiki_articles
│   ├── federation_health_log
│   └── system_alerts
├── supabase/functions/alerts-engine/index.ts
├── supabase/functions/_shared/security.ts   ← withSecurity()
├── src/modules/paste-route/usePasteRoute.ts
├── src/modules/paste-route/RatingModal.tsx
├── src/modules/control/HealthSparkline.tsx
├── src/modules/control/AlertsPanel.tsx
├── src/pages/Wiki.tsx
├── src/pages/LTOS.tsx
└── SECURITY.md

MODIFICADO
├── src/modules/paste-route/RutaDelPasteSVG.tsx   (data-driven)
├── src/pages/ControlCenter.tsx                    (sparklines + alertas)
├── src/pages/Index.tsx                            (KPIs reales)
├── src/components/rdm/FloatingNav.tsx             (+ wiki, ltos)
├── src/components/rdm/DedicationBand.tsx          (shimmer)
├── src/App.tsx                                    (+ rutas)
├── index.html                                     (CSP/HSTS/OG)
└── supabase/functions/federation-health/index.ts  (persiste histórico)
```

Costo estimado: **1–2 turnos de build** (deja 3+ créditos de margen para ajustes en vivo mañana).

---

## Pregunta única antes de ejecutar

¿Apruebo este plan tal cual y procedo, o quieres que prioricé/recortara algo específico (por ejemplo: saltar Wiki para enfocar todo en Control Center + Ruta del Paste)?
