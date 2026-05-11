## Plan de evolución AAA — Real del Monte Digital

Vamos a transformar la plataforma en una experiencia inmersiva completa con monetización clara y lógica de negocio sostenible. Trabajaremos en 6 bloques.

---

### Bloque 1 — Sidebar (`AppSidebar.tsx`) y FloatingNav (`FloatingNav.tsx`)

Aplicaré los rediseños que propones:

- **AppSidebar**: animación spring (260/26), ancho expandido 256 / colapsado 76, logo con glow dorado en hover, branding "RDM DIGITAL · TAMV MD‑X5", botón "Volver al portal público", indicador `activeGlow` con `layoutId`, badge "activo" en ítem activo, status "Instancia soberana activa · Sesión cifrada · Nodo MD‑X5".
- **FloatingNav**: header flotante con efecto `scrolled` (>80px), logo `rdm-logo.png`, 7 ítems principales (Inicio, Historia, Gastronomía, Lugares, Mapa, Rutas, Comunidad), Dashboard y Realito en menú secundario, botón Auth (Entrar/Salir) con `supabase.auth.onAuthStateChange`, menú móvil deslizante.

---

### Bloque 2 — Home (`Index.tsx`) reconstruida

Página de bienvenida cinematográfica con secciones redireccionables:

1. **Hero inmersivo** — fondo aerial con Ken Burns, título "Real del Monte · Pueblo Mágico Digital", subtítulo invitación a la aventura, CTA dual "Iniciar aventura" / "Explorar mapa".
2. **Grid de secciones** (cards con imagen + hover parallax): Historia, Cultura, Gastronomía, Mitos y Leyendas, Recorridos, Eventos.
3. **Mapa en tiempo real** embebido (preview de Leaflet centrado en RDM con 5 markers destacados + CTA "Abrir mapa completo").
4. **Sitios de interés** — carrusel con Museos, Minas, Miradores.
5. **Eventos próximos** — timeline vertical con próximos 3 eventos.
6. **Catálogo de comercios premium** — grid con solo comercios `is_subscribed = true`.
7. **Recorridos guiados** — 3 paquetes destacados con precio y CTA reservar.
8. **Veta Soberana (gamificación)** — banner con CTA "Activar Premium".
9. **Realito AI** — banner con CTA chat.

---

### Bloque 3 — Mapa visual mejorado (`Mapa.tsx`)

- Tile layer **CartoDB Voyager** (más legible y cálido) con overlay de gradiente dorado sutil.
- Markers SVG personalizados por categoría con halo pulsante (animación CSS).
- Mini-card flotante con imagen del lugar, rating, schedule y CTA "Cómo llegar".
- Panel lateral colapsable con lista filtrable sincronizada con markers.
- Leyenda con contadores en vivo.
- Botón "Centrar en RDM" + "Mi ubicación".
- Sólo lugares/comercios `is_active = true` y comercios `is_subscribed = true`.

---

### Bloque 4 — Catálogo de Comercios + Recorridos guiados (esquema BD)

Migración SQL para añadir lógica de negocio:

**Tablas nuevas:**
- `commerce_subscriptions` (business_id, plan: 'mensual'|'trimestral', amount, status, started_at, expires_at)
- `tour_guides` (name, bio, languages[], avatar_url, rating, is_active)
- `tour_packages` (title, description, duration_min, price, max_capacity, image_url, includes[])
- `tour_availability` (package_id, guide_id, date, time, capacity_left)
- `tour_bookings` (user_id, package_id, availability_id, persons, total_paid, status: 'pendiente'|'confirmada'|'completada')
- `events` (title, description, date, location, image_url, category)
- `rewards` (title, description, business_id, type: 'descuento'|'producto'|'experiencia', value, stock, points_cost)
- `reward_redemptions` (user_id, reward_id, code, redeemed_at, used_at)

**Páginas nuevas:**
- `/comercios` — grid de comercios suscritos con filtros por sector.
- `/recorridos` (refactor de Rutas o nueva) — listado de paquetes + flujo reserva (fecha/hora/personas).
- `/eventos` — calendario de eventos.

---

### Bloque 5 — Realito AI con filtrado estricto

Modifico `supabase/functions/chat/index.ts`:

- Antes de responder, consulta tablas `places (is_active=true)`, `businesses (is_subscribed=true AND is_active=true)`, `events`, `tour_packages`.
- Inyecta el catálogo filtrado en el `system prompt` como contexto.
- System prompt refuerza: **"Solo puedes recomendar lugares y comercios que aparecen en el catálogo proporcionado. Si te preguntan por un comercio que no está en la lista, indica que no está registrado oficialmente en RDM Digital."**

---

### Bloque 6 — Gamificación Veta Soberana con economía sostenible

**Fórmula de sostenibilidad:**

```text
Ingreso mensual = (Σ Premium suscripciones × $99) + (Σ Comercios × $cuota) + (comisión 15% bookings)
Costo de premios = Σ rewards canjeados × valor real
Margen objetivo = Ingreso − Costo ≥ 40%

Reglas:
- Premium MXN $99/mes desbloquea minería + canje
- Cada reward tiene `points_cost` calculado: points = (valor_MXN / 0.30) 
  (techo: el usuario debe minar el equivalente al 70% del valor para canjear → margen 30% para plataforma)
- Stock limitado por reward (controla exposure)
- Cooldown de 24h entre canjes
- Comercio aporta el premio a cambio de visibilidad + tráfico (no costo directo a plataforma)
```

**Implementación:**
- Tabla `subscriptions_premium` (user_id, status, started_at, expires_at, amount).
- En `GamePortal.tsx`: gating — si `!isPremium` muestra paywall con CTA Stripe.
- Tabla `rewards` con `points_cost` autocalculado.
- Página `/recompensas` con catálogo canjeable (filtra por puntos del usuario).
- Trigger SQL que descuenta `total_minerals` y crea `reward_redemption` con código único.

**Pagos**: integraremos **Stripe** built-in para Premium ($99/mes), suscripción de comercios ($499/mes o $1,299/trim) y bookings de recorridos. Stripe se habilita en una segunda fase tras tu confirmación.

---

### Orden de ejecución (esta iteración)

Para no romper nada y entregar valor incremental, esta iteración cubre:

1. **AppSidebar** + **FloatingNav** rediseñados (los snippets que pasaste, completados y funcionales).
2. **Home** reconstruida con las 9 secciones (datos mock donde aún no hay BD; reales donde ya existe).
3. **Mapa** con tiles Voyager, markers SVG con halo, panel lateral, mini-card mejorada.
4. **Migración BD**: tablas commerce_subscriptions, tour_guides, tour_packages, tour_availability, tour_bookings, events, rewards, reward_redemptions, subscriptions_premium + RLS + datos seed.
5. **Realito AI** con filtrado estricto de catálogo.
6. **Página `/comercios`** y **`/recorridos`** funcionales (sin pago real aún, botón "Reservar" crea booking en `pendiente`).
7. **GamePortal** con paywall + catálogo de recompensas con fórmula sostenible.

**Diferido a próxima iteración (requiere tu aprobación):**
- Activar **Stripe payments** built-in (Premium, comercios, bookings) — lo haremos cuando confirmes.
- Panel admin para que comercios suban su info y elijan plan.

¿Apruebas este plan para comenzar?
