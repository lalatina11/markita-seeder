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

To run the complete seeding process with defaults (5 users, 5 stores, 4 products per store):

```bash
bun run seed
# or
bun run src/index.ts
```

### Custom Options

You can customize the number of entities using CLI flags:

```bash
# Seed 10 users, 8 stores, and 5 products per store
bun run seed --users=10 --stores=8 --products=5
```

### Environment Variables

Configure via `.env`:

- `BASE_URL`: Base URL of the Markita backend

### Help

```bash
bun run seed --help
```
