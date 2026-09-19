# Markita Seeder

Database seeding application for the **Markita** server application.

## Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- Running Markita server configured via `.env`

## Installation

```bash
bun install
```

## Running the Seeder

To run the seeding process with defaults (5 users, 5 stores, 20 products):

```bash
bun run seed
# or
bun run src/index.ts
```

### High-Volume / Large-Scale Seeding

The seeder includes built-in database protection features:
- **Connection pooling & concurrency control**: Prevents exhausting database connection limits.
- **Exponential backoff with jitter**: Retries transient server errors and locks up to 3 times.
- **Pacing delay**: Smooths out write spikes.
- **Fault tolerance**: Continues gracefully if individual items fail.

```bash
# Seed 100 users, 50 stores, and 500 products distributed across stores
bun run seed --users=100 --stores=50 --products=500
```

### CLI Options

| Option | Description | Default |
|---|---|---|
| `--users=<num>` | Total users to create | `5` |
| `--stores=<num>` | Total stores to create | `5` |
| `--products=<num>` | Total products to distribute across stores | `20` |
| `--products-per-store=<num>` | Explicit products per store (overrides `--products`) | - |
| `--concurrency=<num>` | Max concurrent HTTP requests | `4` |
| `--delay=<ms>` | Pacing delay between requests in milliseconds | `15` |
| `--retries=<num>` | Max retry attempts per request on failure | `3` |
| `--help, -h` | Show help message | - |

### Environment Variables

Configure via `.env`:

- `BASE_URL`: Base URL of the Markita backend

### Help

```bash
bun run seed --help
```
