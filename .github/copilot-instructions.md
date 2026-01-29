# 🧾 **Sistema de Promociones Multiplataforma (USD Único)**

## 1. Objetivo

Crear un sistema centralizado que permita **definir, activar y finalizar promociones** de productos en múltiples plataformas (Stripe, Xsolla, PayPal) desde un único backend, asegurando sincronización automática de precios, coherencia visual en todas las tiendas y rollback controlado.

---

## 2. Alcance

**Incluye:**

- Promociones con **precio final predefinido por SKU** (calculado y ajustado desde el front).
- Aplicación automática por fechas (`startsAt`, `endsAt`).
- Sincronización con las plataformas externas.
- Rollback automático al finalizar.

**No incluye:**

- Descuentos individuales por usuario o códigos de cupón personalizados.
- Suscripciones o precios recurrentes.

---

## 3. Flujo General

### 3.1 Creación

1. En el **front**, el administrador selecciona:
   - Si la promoción aplica un **mismo descuento** o **por SKU**.
   - El porcentaje o monto de descuento.
   - Los precios **finales exactos** (ajustables a .99).

2. El sistema calcula los descuentos y permite modificar el precio final.
3. Al guardar, se registra en DB la información completa con:
   - Precio base.
   - Precio final aprobado.
   - Descuento (monto y %).
   - Fechas de vigencia.
   - Estado inicial `scheduled`.

---

### 3.2 Activación automática

Cuando llega `startsAt`:

1. Worker cambia estado a `activating`.
2. Por cada SKU, se sincroniza con las plataformas:
   - **Stripe** → crea un `Price` nuevo con el precio final.
   - **Xsolla** → crea o actualiza una `Promotion` con `amount_off` = base − final.
   - **PayPal** → no requiere sync (se usa precio final runtime).

3. Actualiza `platformSync` con IDs generados y marca la promoción `active`.

---

### 3.3 Compra del usuario

- El backend consulta si hay una promoción activa para el SKU.
- Dependiendo de la plataforma:
  - **Stripe:** usa el `Price` promocional creado.
  - **PayPal:** aplica directamente el `finalPrice` en la orden.
  - **Xsolla:** ya muestran el precio actualizado.

- El checkout o link reflejará el **precio final exacto** definido en la promoción.

---

### 3.4 Visualización en UI

La API devuelve para cada producto:

```json
{
  "base": 84.99,
  "final": 49.99,
  "amountOff": 35.0,
  "percentOff": 41.18,
  "label": "40% OFF"
}
```

Así, la UI muestra precios consistentes con las plataformas sin necesidad de cálculo local.

---

### 3.5 Finalización

Cuando llega `endsAt`:

1. Worker cambia estado a `ending`.
2. Restaura valores:
   - **Stripe:** vuelve al `defaultPriceId`.
   - **Xsolla:** desactiva la `Promotion`.
   - **PayPal:** no requiere acción.

3. Estado final: `ended`.

---

## 4. Modelos de Datos (MongoDB)

### 4.1 `products`

```json
{
  "sku": "TOKENS_30000",
  "name": "30,000 Tokens",
  "basePrice": 84.99,
  "active": true,
  "platforms": {
    "stripe": {
      "productId": "prod_abc123",
      "defaultPriceId": "price_base_usd_123"
    },
    "paypal": {
      "productId": "PROD-XYZ"
    },
    "xsolla": {
      "sku": "tokens_30000"
    }
  },
  "createdAt": "2025-10-20T00:00:00Z",
  "updatedAt": "2025-10-21T12:00:00Z"
}
```

---

### 4.2 `promotions`

```json
{
  "name": "Anniversary 2025",
  "schedule": {
    "startsAt": "2025-08-14T00:00:00Z",
    "endsAt": "2025-08-21T00:00:00Z"
  },
  "state": "scheduled",
  "scope": { "mode": "skus" },
  "lines": [
    {
      "sku": "TOKENS_30000",
      "finalPrice": 49.99,
      "baseSnapshot": 84.99,
      "discount": {
        "amountOff": 35.0,
        "percentOff": 41.18
      },
      "platformSync": {
        "stripe": {
          "priceId": "price_promo_usd_999"
        },
        "paypal": {},
        "xsolla": {
          "promotionId": "",
          "amountOff": 35.0
        }
      }
    }
  ],
  "createdAt": "2025-07-20T10:00:00Z",
  "updatedAt": "2025-07-21T16:00:00Z",
  "activatedAt": null,
  "endedAt": null
}
```

---

## 5. Estados del Ciclo de Vida

| Estado       | Descripción                                |
| ------------ | ------------------------------------------ |
| `scheduled`  | Promoción creada, esperando activación     |
| `activating` | Creando o actualizando precios en tiendas  |
| `active`     | En curso, visible en todas las plataformas |
| `ending`     | Revirtiendo cambios                        |
| `ended`      | Finalizada y restaurada al precio base     |

---

## 6. Integraciones por Plataforma

| Plataforma | Tipo de integración     | Acción de inicio                                | Acción de fin              |
| ---------- | ----------------------- | ----------------------------------------------- | -------------------------- |
| **Stripe** | API REST (`/v1/prices`) | Crear `Price` con el precio final               | Restaurar `defaultPriceId` |
| **PayPal** | API Orders v2           | Usar `unit_amount = finalPrice` (runtime)       | N/A                        |
| **Xsolla** | Shop Builder API        | Crear `Promotion` (`amount_off = base − final`) | Desactivar promoción       |

---

## 7. Procesos Automáticos

### Worker — Activación

1. Busca promociones `state=scheduled` y `startsAt ≤ now`.
2. Sincroniza precios con cada plataforma.
3. Guarda IDs y marca `active`.

### Worker — Finalización

1. Busca `state=active` y `endsAt ≤ now`.
2. Restaura precios base en todas las plataformas.
3. Marca `ended`.

⏱ Frecuencia: cada 5 minutos
🕒 Tiempos: UTC

---

## 8. API Interna

| Método   | Endpoint                      | Descripción               |
| -------- | ----------------------------- | ------------------------- |
| `POST`   | `/v1/promotions`              | Crear promoción           |
| `GET`    | `/v1/promotions`              | Listar todas              |
| `GET`    | `/v1/promotions/:id`          | Ver detalle               |
| `PATCH`  | `/v1/promotions/:id`          | Editar (antes de iniciar) |
| `DELETE` | `/v1/promotions/:id`          | Cancelar antes del inicio |
| `POST`   | `/v1/promotions/:id/activate` | Forzar activación manual  |
| `POST`   | `/v1/promotions/:id/end`      | Finalizar manualmente     |

---

## 9. Estructura de visualización (UI)

Ejemplo del objeto retornado en la tienda:

```json
{
  "sku": "TOKENS_30000",
  "display": {
    "base": 84.99,
    "final": 49.99,
    "amountOff": 35.0,
    "percentOff": 41.18,
    "label": "40% OFF"
  }
}
```

---

## 10. Reglas y buenas prácticas

- Todas las fechas deben manejarse en **UTC**.
- Cada acción de sincronización debe ser **idempotente**.
- Registrar logs y errores en `platformSync.status` y `audit`.
- Mantener **`baseSnapshot`** para rollback seguro.
- Promociones preferiblemente configuradas con precios .99.
- La UI y el backend **nunca calculan descuentos en tiempo real**; usan los valores guardados.

---

## 11. Métricas de Éxito

✅ Fuente única de verdad (Mongo).
✅ Activaciones y finalizaciones automáticas.
✅ Sincronización consistente entre Stripe, Xsolla y PayPal.
✅ Rollback confiable sin intervención manual.
✅ Precios coherentes en UI, backend y tiendas externas.

## 12. Tecnologias Utilizadas

- Lenguaje: Typescript
- Runtime: Bun.js
- Framework: Elysia
- Database: MongoDB
- APIs Externas: Stripe, Xsolla, PayPal
- Queue/Worker: BullMQ

## 13. Estructura del Repositorio

```text
src/
├── index.ts                  # API HTTP
├── seeds.ts                  # Seeds
├── commons/                  # Shared utilities
│   ├── dto.ts
│   └── ...
├── config/                   # Config settings
│   ├── env.ts                # Environment variables
│   └── ...
├── core/                     # Core logic
│   ├── db.ts                 # Database connection
│   ├── logger.ts             # Logger
│   └── ...
├── modules/                  # Feature modules
│   ├── products/
│   │   ├── dto.ts            # Product-related DTOs (Validators)
│   │   ├── model.ts          # Product model (DB Schema)
│   │   ├── repository.ts     # Product data access
│   │   ├── router.ts         # Product API routes
│   │   ├── service.ts        # Product business logic
│   │   └── ..
│   └── ...
├── plugins/                  # Elysia plugins
│   ├── requestId.ts          # Request ID plugin
│   ├── requestLogger.ts      # Request logging plugin
│   └── ...
├── seeders/                  # Seeders logic
│   ├── products/
│   │   ├── init.ts           # Seeder to create the initial products
│   │   └── ..
│   ├── index.ts              # Seeders main entry
│   └── ...
├── utils/                    # Utility functions
│   ├── db.ts                 # Database utilities
│   └── ...
```
