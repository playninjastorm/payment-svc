# NinjaKaizen — Payment / Promotions Service

> A central backend service to define, schedule and synchronize product promotions across multiple selling platforms (Stripe, Xsolla, PayPal, Google Play). All prices are managed in USD as the single source of truth.

## Purpose

This service provides a single system of record for product promotions. Administrators create promotions (globally or per-SKU) with exact final prices; the service automatically activates promotions on schedule, synchronizes prices with external platforms, and restores base prices when promotions end.

Key goals:
- Single source of truth for promotional prices (stored in MongoDB).
- Automated activation and rollback across platforms.
- Idempotent platform syncs and robust worker-driven scheduling.

## Main Features

- Create, schedule, update and cancel promotions.
- Specify final prices per SKU.
- Automatic activation at `startsAt` and automatic rollback at `endsAt`.
- Synchronization with: Stripe, Xsolla, Google Play (and PayPal at runtime).
- Audit and platform sync metadata for rollback safety.

## Technology Stack

- Language: Rust
- HTTP framework: Axum
- Database: MongoDB
- Integrations: Stripe API, Xsolla API, Google Play API, PayPal API
- Background jobs: Worker binary (scheduled activation & ending)

## Repo Structure (important files)

Top-level layout (src/):

A concise tree of the main files and folders:

```
.
├── Cargo.toml
└── src/
    ├── lib.rs
    ├── main.rs
    ├── bin/
    │   ├── seed.rs
    │   └── worker.rs
    ├── config/
    │   ├── env.rs
    │   └── db.rs
    ├── http/
    │   └── v1/
    │       ├── products.rs
    │       ├── promotions.rs
    │       └── ...
    ├── features/
    │   ├── products/
    │   │   ├── product_models.rs
    │   │   ├── product_repo.rs
    │   │   ├── product_svc.rs
    │   │   └── ...
    │   ├── promotions/
    │   │   ├── promotion_models.rs
    │   │   ├── promotion_repo.rs
    │   │   ├── promotion_svc.rs
    │   │   └── ...
    │   └── ...
    ├── jobs/
    │   └── ...
    └── seeds/
        ├── product_seeds.rs
        └── ...

```

See the code for more detail: models live under `src/features/...` and handlers under `src/http/v1`.

## API (internal)

Primary endpoints (internal API surface):

- `GET /v1/products` — list products (includes `display` pricing when a promotion applies).
- `POST /v1/buy` — create a purchase/order (platform-specific flows depend on platform integration).
- `POST /v1/promotions` — create promotion (body includes scope, lines, schedule and final prices).
- `GET /v1/promotions` — list promotions
- `GET /v1/promotions/:id` — get promotion detail
- `PATCH /v1/promotions/:id` — edit promotion (allowed only while `state` is `scheduled`)
- `DELETE /v1/promotions/:id` — cancel/delete promotion (before activation)
- `POST /v1/promotions/:id/activate` — force activation (manual override)
- `POST /v1/promotions/:id/end` — force end (manual override)

## Worker: Activation & Finalization

The worker (binary `bin/worker.rs`) performs the automated lifecycle:

1. Activation job:
   - Find promotions with `state = scheduled` and `startsAt <= now`.
   - Set `state = activating` and sync per-SKU with each platform:
     - Stripe: create a new `Price` for the promo and store `priceId`.
     - Xsolla: create or update a `Promotion` with `amount_off`.
     - Google Play: update the `inappProduct` price.
     - PayPal: no long-lived sync needed (use final price at order time).
   - Mark `platformSync` IDs/status and set `state = active`.

2. Finalization job:
   - Find promotions with `state = active` and `endsAt <= now`.
   - Set `state = ending` and revert each platform:
     - Stripe: restore `defaultPriceId` for the product.
     - Xsolla: deactivate the promotion.
     - Google Play: restore base price.
   - Mark `state = ended` and record `endedAt`.

Behavioural notes:

- Jobs should run periodically (suggested every 1 minutes). The worker binary in `src/bin/worker.rs` can be run as a persistent process, or scheduled via `systemd`/`cron` to run every N minutes.
- Sync operations must be idempotent and log results to `platformSync.status`.

How to run the worker locally:

```bash
# Run continuously (foreground)
cargo run --bin worker

# Run once (if implemented to process due items and exit)
cargo run --bin worker -- --once
```

Or run periodic invocations via `cron` every 1 minutes if the binary supports a single-run mode.

## Running locally

Prerequisites:

- Rust 
- MongoDB accessible (local or hosted)
- Platform API credentials for Stripe/Xsolla/Google/PayPal in environment variables or config

Configuration:

- Copy the repository root sample env (if present) and set required variables. For example, if there is a `.env.example` file, do:

```bash
cp .env.example .env
# edit .env and fill values: MONGODB_URI, STRIPE_KEY, XSOLLA_KEY, GOOGLE_PLAY_JSON, PAYPAL_CLIENT_ID, etc.
```

- Required variables (examples):

- `MONGODB_URI` — MongoDB connection string
- `APP_ENV` — development | production
- `STRIPE_API_KEY` — Stripe API key
- `XSOLLA_API_KEY` — Xsolla API key
- `GOOGLE_PLAY_SERVICE_ACCOUNT` — path or JSON for Google Play
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` — PayPal credentials

Ensure the configured MongoDB is reachable and credentials are set before running the seeder.

Typical commands from the project root:

```bash
# Start the API server (development)
cargo run

# Run the seeder to create sample products/data (the seeder executes logic defined in `src/bin/seed.rs` and `seeds/`)
cargo run --bin seed

# Run the worker for activation/finalization (foreground)
cargo run --bin worker
```

## Seeders

The seeder binary `src/bin/seed.rs` executes project-specific seeding logic (creates product documents, default platform ids, or example promotions). Typical usage:

```bash
cargo run --bin seed
```