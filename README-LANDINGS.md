# Documentación completa de Landings

## Índice

- [Resumen general](#resumen-general)
- [Landing 1.0](#landing-10)
- [Landing 1.25 (Chiva77)](#landing-125-chiva77)
- [Landing 1.25 DuckLuck (CRM)](#landing-125-duckluck-crm)
- [Landing 1.5](#landing-15)
- [Tabla comparativa](#tabla-comparativa)
- [Campaña Meta Ads recomendada](#campaña-meta-ads-recomendada)
- [Cómo replicar una landing para un nuevo cliente](#cómo-replicar-una-landing-para-un-nuevo-cliente)

---

## Resumen general

Todas las landings comparten la misma base visual y de performance:

- **HTML estático** con fondo AVIF, overlay oscuro, logo, título, botón WhatsApp y subtítulo.
- **Meta Pixel diferido**: stub mínimo en `<head>` + carga real en `setTimeout(0)`. No bloquea el primer pintado.
- **Critical CSS inline**: estilos esenciales en `<head>`, `styles.css` cargado async (`media="print" onload`).
- **Redirect instantáneo**: `window.location.assign()` sin delays ni awaits.
- **Selección aleatoria**: los números se eligen al azar con `Math.random()` en cada visita, distribuyendo el tráfico entre usuarios.
- **Anti doble-click**: flag `__waInFlight` + reset en `pageshow`/`visibilitychange`.
- **Promo code único**: UUID de 12 chars por click, incluido en el mensaje de WhatsApp.
- **Accesibilidad**: `aria-label`, `:active`, `:focus-visible`, `prefers-reduced-motion`.
- **Responsive**: media queries para 480px, 768px y 1024px.
- **Preconnect/preload**: `connect.facebook.net` (preconnect + dns-prefetch), fondo AVIF (preload + fetchpriority high).

La diferencia entre versiones es **qué pasa además de la redirección**.

---

## Landing 1.0

**Repo**: `Chiva77-Landing1.0`
**Deploy**: Vercel (estático)
**Archivos**: `index.html`, `styles.css`, `imagenes/`

### Qué hace

1. El usuario llega a la landing.
2. El Pixel dispara `PageView` (diferido, no bloquea).
3. El usuario toca el botón.
4. Se selecciona un número al azar del array `FIXED_PHONES`.
5. Se genera un **promo code** único: `{LANDING_TAG}-{uuid12}` (ej: `CH1.0-3a8f2bc91d4e`).
6. Se construye un **mensaje aleatorio** (de 20 variantes) con el promo code al final.
7. El Pixel dispara `Contact` enriquecido (em, ph, fn, ln, external_id, eventID, utm, device_type, brand).
8. **Redirect instantáneo** a `https://wa.me/{número}?text={mensaje}`.

### Qué NO hace

- No envía datos a Google Sheets.
- No envía eventos por CAPI (Conversions API server-side).
- No detecta geolocalización.
- No tiene backend ni APIs.

### Archivos

| Archivo | Descripción |
|---------|-------------|
| `index.html` | HTML + CSS crítico inline + Pixel diferido + JavaScript inline |
| `styles.css` | Estilos completos (cargado async) |
| `imagenes/` | `fondo.avif`, `logo.png`, `whatsapp.png`, `favicon.ico` |

### Configuración editable (en `index.html`)

```javascript
const LANDING_CONFIG = {
  BRAND_NAME: "DON SOCIAL",
  MODE: "ads",
  PROMO: { ENABLED: true, LANDING_TAG: "CH1.0" }
};

const FIXED_PHONES = [
  "5493516768842"
];
```

### Pixel ID

Hardcodeado en el bloque `<script>` del `<head>`:
- `fbq("init", "1459000075661483", {...})`
- `<noscript>` img con el mismo ID

### Flujo del click

```
Click → getNumberFromFixed() [sync, localStorage]
      → buildMensaje() [aleatorio + promo_code]
      → fbq("track", "Contact", {...}) [no bloquea]
      → window.location.assign("https://wa.me/...") [instantáneo]
```

---

## Landing 1.25 (Chiva77)

**Repo**: `Chiva77-Landing1.25`
**Deploy**: Vercel
**Archivos**: `index.html`, `styles.css`, `imagenes/`, `api/xz3v2q.js`, `credenciales/google-sheets.js`

### Qué hace (todo lo de la 1.0 +)

1. Todo lo que hace la 1.0 (Pixel PageView, Contact enriquecido, selección aleatoria, redirect instantáneo).
2. **Detecta geolocalización** del visitante via `ipapi.co/json/` (con timeout de 900ms, no bloquea).
3. **Recolecta datos de identidad**: fbp, fbc (cookies Meta), external_id, IP del servidor, User-Agent.
4. **Envía todo a Google Sheets** via API Vercel (`/api/xz3v2q`) con `fetch` + `keepalive:true` (no bloquea el redirect).
5. El Apps Script en Google Sheets recibe los datos y los almacena.
6. Posteriormente, el Apps Script envía eventos **Lead** y **Purchase** a Meta via **CAPI** (Conversions API server-side).

### Flujo del click

```
Click → getNumberFromFixed() [sync, localStorage]
      → buildMensaje() [aleatorio + promo_code]
      → fbq("track", "Contact", {...}) [no bloquea]
      → (async background) detectarGeo() → fetch("/api/xz3v2q", {keepalive}) [no bloquea]
      → window.location.assign("https://wa.me/...") [instantáneo]
```

### Backend (Vercel Serverless)

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| `api/xz3v2q.js` | `POST /api/xz3v2q` | Recibe JSON del frontend, extrae IP + UA del request, reenvía todo al Apps Script de Google Sheets |
| `credenciales/google-sheets.js` | (importado) | Contiene la URL del Apps Script |

### `/api/xz3v2q.js` — Qué hace

1. Recibe POST con JSON body.
2. Extrae `client_ip` de `x-forwarded-for` (filtra IPs privadas).
3. Extrae `user-agent` del header.
4. Destructura todos los campos del payload (event_id, external_id, fbp, fbc, email, phone, geo, etc.).
5. Arma un `sheetPayload` con timestamp.
6. Hace `fetch(GOOGLE_SHEETS_URL, { method: "POST", body: JSON.stringify(sheetPayload) })`.
7. Retorna `{ success: true }` o error.

### Google Apps Script — Qué hace

El Apps Script es el cerebro del CRM. Tiene 4 modos de entrada:

| Modo | Trigger | Qué hace |
|------|---------|----------|
| **A) Landing contact** | POST sin `action` | Guarda la fila con estado "contact". NO envía CAPI. |
| **B1) LEAD** | POST con `action: "LEAD"` | Busca fila por `promo_code`, actualiza estado a "lead", envía Lead a Meta CAPI con user_data hasheado (SHA-256). |
| **B2) PURCHASE** | POST con `action: "PURCHASE"` | Busca fila por `promo_code`, actualiza estado a "purchase", envía Purchase a Meta CAPI con valor y moneda. Detecta recompras. |
| **C) Simple purchase** | POST con `phone` + `amount` (sin `action`) | Crea fila, hereda identidad de fila previa del mismo phone, envía Purchase a Meta CAPI. |

### CAPI — Datos enviados a Meta

Cada evento Lead/Purchase enviado por CAPI incluye:

- `em`, `ph`, `fn`, `ln` (hasheados SHA-256)
- `ct`, `st`, `zp`, `country` (normalizados con `normForMeta()` + hasheados)
- `fbp`, `fbc` (sin hashear, Meta lo requiere así)
- `client_ip_address`, `client_user_agent` (sin hashear)
- `external_id` (hasheado)
- `event_id` (para deduplicación con el Pixel browser)
- `event_time`, `event_source_url`, `action_source: "website"`

### Configuración editable

```javascript
// index.html
const LANDING_CONFIG = {
  BRAND_NAME: "",
  MODE: "ads",
  PROMO: { ENABLED: true, LANDING_TAG: "CT1" },
  GEO: { ENABLED: true, PROVIDER_URL: "https://ipapi.co/json/", TIMEOUT_MS: 900 }
};

const FIXED_PHONES = [
  "5493516783675",
  "5493516768842"
];
```

```javascript
// credenciales/google-sheets.js
export const CONFIG_SHEETS = {
  GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/..../exec'
};
```

---

## Landing 1.25 DuckLuck (CRM)

**Repo**: `DuckLuck-Landing1.25-CRM`
**Deploy**: Vercel (`duck-luck-3.vercel.app`)
**Archivos**: Mismos que Chiva77 1.25

### Diferencia principal con Chiva77 1.25

La funcionalidad es **idéntica**. La única diferencia es cómo llega el `promo_code` al Apps Script:

| | Chiva77 1.25 | DuckLuck 1.25 |
|---|---|---|
| **Automatización WhatsApp** | Bot extrae el promo_code limpio del mensaje y lo envía | CRM extrae el **mensaje completo** como texto crudo |
| **Apps Script** | Recibe `promo_code: "CT1-3a8f2bc91d4e"` | Recibe `promo_code: "Hola! Vi este anuncio, me pasás info? DL3-3a8f2bc91d4e"` |
| **Extracción** | No necesita (ya viene limpio) | Usa `extractPromoCode()` con regex `/([A-Za-z0-9]{2,10}-[a-f0-9]{12})\b/i` |

### Función extra: `handleWhapifyIdentity` (modo D)

DuckLuck tiene un modo adicional en el Apps Script:

```
POST { phone: "5493513131230", promo_code: "Hola! Vi anuncio DL3-abc123def456" }
(sin campo "action")
```

Este modo:
1. Extrae el promo_code limpio del texto crudo.
2. Busca la fila en la Sheet por ese promo_code.
3. Actualiza el `phone` de esa fila (resuelve la identidad: "este promo_code pertenece a este teléfono").
4. NO envía CAPI. NO cambia estado.

Esto es necesario porque el CRM envía el phone del usuario por separado, y el landing ya guardó la fila con el promo_code pero sin el phone real del usuario.

### Flujo Lead/Purchase en DuckLuck

A diferencia de Chiva77 (que busca por `promo_code`), DuckLuck busca por **phone**:

- `handleActionLead`: busca la última fila con ese phone, cambia estado a "lead", envía Lead CAPI.
- `handleActionPurchase`: busca la última fila con ese phone, actualiza estado/valor, envía Purchase CAPI.

Esto es porque el CRM ya resolvió la identidad (promo_code → phone) en el paso de Whapify.

---

## Landing 1.5

**Repo**: `Chiva77-Landing1.5`
**Deploy**: Vercel (`geraganamos.vercel.app`)
**Archivos**: `index.html`, `styles.css`, `app.js`, `imagenes/`, `api/`, `credenciales/`, `vercel.json`, `package.json`

### Diferencia principal: números dinámicos

En lugar de tener números hardcodeados, la 1.5 obtiene los números desde un **pool dinámico almacenado en Redis** (Upstash). Los números provienen de una fuente externa ("ases") y se refrescan periódicamente.

### Arquitectura

```
                                    ┌─────────────────┐
                                    │   Fuente externa │
                                    │  (ases/upstream) │
                                    └────────┬────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │  /api/phones-refresh (CRON)  │
                              │  Obtiene números → guarda    │
                              │  en Redis (TTL 20 min)       │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │    Upstash Redis             │
                              │    Key: "phones_pool"        │
                              │    Valor: {numbers, count,   │
                              │            ts, agency_id}    │
                              └──────────────┬──────────────┘
                                             │
    ┌────────────┐            ┌──────────────▼──────────────┐
    │  Browser   │───prewarm──│  /api/phones-pool            │
    │  (app.js)  │            │  Lee Redis → devuelve        │
    │            │            │  números al frontend          │
    └─────┬──────┘            └─────────────────────────────┘
          │
          │ click
          │
          ▼
    redirect wa.me + fetch /api/xz3v2q (→ Google Sheets → CAPI)
```

### Archivos

| Archivo | Descripción |
|---------|-------------|
| `index.html` | HTML + CSS crítico + Pixel diferido. JS mínimo. |
| `app.js` | JavaScript principal (cargado con `defer` + `preload`). Contiene toda la lógica: config, helpers, prewarm, contactarWhatsApp, UI. |
| `styles.css` | Estilos completos + `.wa-btn-loading` para estado de carga del botón. |
| `vercel.json` | Configuración del cron job de Vercel. |
| `package.json` | Dependencia: `@upstash/redis`. |
| `api/phones-pool.js` | Endpoint que lee números desde Redis (o fallback a upstream). |
| `api/phones-refresh.js` | Endpoint que el cron llama para refrescar Redis desde la fuente. |
| `api/_lib/phones-upstream.js` | Función que consulta la fuente externa de números. |
| `api/xz3v2q.js` | Igual que en 1.25: recibe datos del frontend y reenvía a Google Sheets. |
| `credenciales/google-sheets.js` | URL del Apps Script. |

### Cron Job (Vercel)

**Archivo**: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/phones-refresh",
      "schedule": "0 6 * * *"
    }
  ]
}
```

- **Frecuencia**: Una vez al día a las 06:00 UTC (límite del plan Hobby de Vercel).
- **Qué hace**: Llama a `/api/phones-refresh` que obtiene números de la fuente externa y los guarda en Redis.
- **Protección**: Requiere `CRON_SECRET` via header `Authorization: Bearer` o query `?secret=`.

### Cron externo (cron-job.org)

Para refrescar más de una vez al día (limitación del plan Hobby de Vercel), se usa un cron externo:

- **Servicio**: [cron-job.org](https://cron-job.org) (gratis).
- **URL**: `https://geraganamos.vercel.app/api/phones-refresh?secret={CRON_SECRET}`
- **Frecuencia**: Configurable (ej: cada 4 horas).

### `/api/phones-refresh.js` — Detalle

1. Valida autorización (CRON_SECRET via header o query).
2. Inicializa conexión a Upstash Redis.
3. Llama a `fetchNumbersFromAses()` (fuente externa).
4. Guarda el resultado en Redis con TTL de 20 minutos.
5. Retorna `{ ok: true, count, ts, stored_ttl }`.

### `/api/phones-pool.js` — Detalle

1. Intenta leer de Redis (key `phones_pool`).
2. Si Redis tiene datos → devuelve `{ numbers, count, ts, source: "redis" }`.
3. Si Redis está vacío o falla → fallback a `fetchNumbersFromAses()` directo.
4. Incluye cache headers: `s-maxage=900, stale-while-revalidate=300` (CDN de Vercel cachea 15 min).

### Prewarm del botón

A diferencia de 1.0 y 1.25 (donde el número está listo al instante), la 1.5 necesita hacer un fetch:

1. **Al cargar la página**: el botón muestra "Preparando..." y está deshabilitado (`aria-disabled`, `wa-btn-loading`).
2. **`prewarmNumber()`**: hace fetch a `/api/phones-pool`.
3. **Cuando resuelve**: guarda el resultado en `__pickedResult`, cambia el botón a "¡Contactar ya!" y lo habilita.
4. **Si falla**: usa el `EMERGENCY_FALLBACK_NUMBER` y habilita el botón igual.
5. **Al hacer click**: usa `__pickedResult` (ya en memoria), sin esperar nada. Redirect instantáneo.

### Variables de entorno (Vercel)

| Variable | Descripción |
|----------|-------------|
| `UPSTASH_REDIS_REST_URL` | URL de la instancia Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Token de autenticación de Upstash |
| `CRON_SECRET` | Secret para proteger el endpoint de refresh |

---

## Tabla comparativa

| Propiedad | 1.0 | 1.25 | 1.25 DuckLuck | 1.5 |
|-----------|-----|------|---------------|-----|
| **Números** | Fijos (aleatorio) | Fijos (aleatorio) | Fijos (aleatorio) | Dinámicos (Redis pool, aleatorio) |
| **Google Sheets** | No | Si | Si | Si |
| **CAPI (Lead/Purchase)** | No | Si (via Apps Script) | Si (via Apps Script) | Si (via Apps Script) |
| **GEO detection** | No | Si (ipapi.co) | Si (ipapi.co) | Si (ipapi.co) |
| **fbp/fbc recolección** | No | Si | Si | Si |
| **Redis** | No | No | No | Si (Upstash) |
| **Cron job** | No | No | No | Si (Vercel + externo) |
| **app.js externo** | No | No | No | Si (defer + preload) |
| **Estado del botón (loading)** | Listo al instante | Listo al instante | Listo al instante | "Preparando..." → listo |
| **Fallback de emergencia** | No necesita | No necesita | No necesita | Si (número hardcodeado) |
| **extractPromoCode()** | No | No | Si (regex de texto crudo) | No |
| **handleWhapifyIdentity** | No | No | Si (resolución phone↔promo) | No |
| **Backend** | Ninguno | 1 API | 1 API | 3 APIs + Redis + Cron |
| **Dependencias npm** | Ninguna | Ninguna | Ninguna | `@upstash/redis` |
| **Complejidad** | Baja | Media | Media | Alta |

---

## Campaña Meta Ads recomendada

| Landing | Objetivo | Optimizar por | Por qué |
|---------|----------|---------------|---------|
| **1.0** | Tráfico o Ventas | Link clicks / Contact | No tiene CAPI; Pixel browser es la única señal. Ventas > Contact si hay volumen (50+/semana). |
| **1.25 / 1.5** | Ventas | Purchase | CAPI envía Purchase con valor → Meta puede optimizar por valor (VBO). Requiere 30+ purchases/semana con 2+ montos distintos. |

### Progresión recomendada para 1.25 / 1.5

| Fase | Volumen | Objetivo | Optimizar por |
|------|---------|----------|---------------|
| Inicio | Pocos datos | Tráfico | Link clicks |
| Madurez | 30+ purchases/semana | Ventas | Purchase |

---

## Cómo replicar una landing para un nuevo cliente

### Replicar 1.0

Copiar `index.html` + `styles.css` + `imagenes/` y cambiar:

| Qué | Dónde |
|-----|-------|
| Pixel ID | `fbq("init","...")` + `<noscript>` img |
| Números | Array `FIXED_PHONES` |
| LANDING_TAG | `LANDING_CONFIG.PROMO.LANDING_TAG` |
| BRAND_NAME | `LANDING_CONFIG.BRAND_NAME` |
| Título | `<title>` |
| Textos | `.title`, `.subtitle`, `.description` |
| Imágenes | Carpeta `imagenes/` |

### Replicar 1.25

Todo lo de 1.0 más:

| Qué | Dónde |
|-----|-------|
| URL Apps Script | `credenciales/google-sheets.js` |
| Autorizar URL del deploy en Apps Script | Google Apps Script > Deploy settings |

### Replicar 1.5

Todo lo de 1.25 más:

| Qué | Dónde |
|-----|-------|
| Variables de entorno en Vercel | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `CRON_SECRET` |
| Crear instancia Upstash Redis | [upstash.com](https://upstash.com) |
| Configurar cron externo | [cron-job.org](https://cron-job.org) con URL + secret |
| EMERGENCY_FALLBACK_NUMBER | `app.js` > `LANDING_CONFIG` |
