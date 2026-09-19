import pc from "picocolors";
import { runSeeder, type PoolProgress } from "./seeder";

interface CliConfig {
  usersCount: number;
  storesCount: number;
  totalProducts: number;
  productsPerStore?: number;
  concurrency: number;
  pacingDelayMs: number;
  maxRetries: number;
}

function parseArgs(): CliConfig {
  const args = process.argv.slice(2);
  let usersCount = 5;
  let storesCount = 5;
  let totalProducts = 20;
  let productsPerStore: number | undefined;
  let concurrency = 4;
  let pacingDelayMs = 15;
  let maxRetries = 3;

  for (const arg of args) {
    if (arg === "--help" || arg === "-h") {
      console.log(`
${pc.bold(pc.cyan("Markita Database Seeder CLI"))}

${pc.bold("Usage:")}
  bun run seed [options]

${pc.bold("Options:")}
  --users=<num>              Number of users to seed (default: 5)
  --stores=<num>             Number of stores to seed (default: 5)
  --products=<num>           Total products to distribute across stores (default: 20)
  --products-per-store=<num> Explicit products per store (overrides --products)
  --concurrency=<num>        Max concurrent requests to avoid pool exhaustion (default: 4)
  --delay=<ms>               Pacing delay between requests in ms (default: 15)
  --retries=<num>            Max retries per request on failure (default: 3)
  --help, -h                 Show this help message

${pc.bold("Environment Variables:")}
  BASE_URL                   Markita server base URL (defined in .env)
`);
      process.exit(0);
    }

    const [key, value] = arg.split("=");
    if (key === "--users" && value) {
      usersCount = Math.max(1, parseInt(value, 10) || usersCount);
    } else if (key === "--stores" && value) {
      storesCount = Math.max(1, parseInt(value, 10) || storesCount);
    } else if (key === "--products" && value) {
      totalProducts = Math.max(1, parseInt(value, 10) || totalProducts);
    } else if (key === "--products-per-store" && value) {
      productsPerStore = Math.max(1, parseInt(value, 10) || 1);
    } else if (key === "--concurrency" && value) {
      concurrency = Math.max(1, parseInt(value, 10) || concurrency);
    } else if (key === "--delay" && value) {
      pacingDelayMs = Math.max(0, parseInt(value, 10) ?? pacingDelayMs);
    } else if (key === "--retries" && value) {
      maxRetries = Math.max(0, parseInt(value, 10) ?? maxRetries);
    }
  }

  return {
    usersCount,
    storesCount,
    totalProducts,
    productsPerStore,
    concurrency,
    pacingDelayMs,
    maxRetries,
  };
}

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

async function checkServerHealth(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/api`, {
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Clean dynamic progress renderer for terminal
 */
function renderProgressBar(
  completed: number,
  total: number,
  successCount: number,
  failureCount: number,
  label: string,
  extra = "",
): void {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 100;
  const barLength = 25;
  const filledLength = Math.round((barLength * percent) / 100);
  const bar = "█".repeat(filledLength) + "░".repeat(barLength - filledLength);

  const failText =
    failureCount > 0 ? pc.red(` (${failureCount} failed)`) : pc.gray(" (0 failed)");

  const line = `  ${pc.cyan(label)} [${pc.green(bar)}] ${pc.bold(
    `${percent}%`,
  )} (${completed}/${total})${failText} ${pc.dim(extra)}`;

  if (process.stdout.isTTY) {
    process.stdout.write(`\r\x1b[K${line}`);
    if (completed >= total) {
      process.stdout.write("\n");
    }
  } else {
    // Non-interactive fallback: log every 10% or on completion
    if (completed === 1 || completed % Math.max(1, Math.floor(total / 10)) === 0 || completed === total) {
      console.log(line);
    }
  }
}

async function main() {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    console.error(pc.red("✖ BASE_URL is not defined in .env"));
    process.exit(1);
  }

  const config = parseArgs();

  console.log(
    pc.bold(
      pc.magenta(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║          🛒  MARKITA DATABASE SEEDER  🛒               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
`),
    ),
  );

  const productTargetText = config.productsPerStore
    ? `${config.productsPerStore} per store (~${config.storesCount * config.productsPerStore} total)`
    : `${config.totalProducts} distributed across stores`;

  console.log(`${pc.cyan("ℹ Target Server:")}    ${pc.bold(baseUrl)}`);
  console.log(
    `${pc.cyan("ℹ Plan:")}             ${pc.bold(
      `${config.usersCount} users, ${config.storesCount} stores, ${productTargetText}`,
    )}`,
  );
  console.log(
    `${pc.cyan("ℹ Safety Guard:")}     ${pc.dim(
      `concurrency: ${config.concurrency}, delay: ${config.pacingDelayMs}ms, max retries: ${config.maxRetries}`,
    )}\n`,
  );

  // Check if server is running
  process.stdout.write(`${pc.gray("Connecting to server...")} `);
  const isHealthy = await checkServerHealth(baseUrl);
  if (!isHealthy) {
    console.log(pc.red("FAILED\n"));
    console.error(
      pc.red(
        `✖ Could not connect to Markita server at ${baseUrl}.\nPlease ensure the server is running.`,
      ),
    );
    process.exit(1);
  }
  console.log(pc.green("CONNECTED ✓\n"));

  const abortController = new AbortController();
  process.on("SIGINT", () => {
    console.log(pc.yellow("\n\n⚠️  Cancellation requested! Waiting for active requests to finish..."));
    abortController.abort();
  });

  console.log(pc.bold(pc.yellow("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")));
  console.log(pc.bold(pc.yellow("  STEP 1: SEEDING USERS")));
  console.log(pc.bold(pc.yellow("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")));

  const results = await runSeeder({
    usersCount: config.usersCount,
    storesCount: config.storesCount,
    totalProducts: config.totalProducts,
    productsPerStore: config.productsPerStore,
    concurrency: config.concurrency,
    pacingDelayMs: config.pacingDelayMs,
    maxRetries: config.maxRetries,
    abortSignal: abortController.signal,
    onUserProgress: (p: PoolProgress<any>) => {
      const latestName = p.latestResult?.response?.user?.display_name ?? "";
      renderProgressBar(
        p.completed,
        p.total,
        p.successCount,
        p.failureCount,
        "👤 Users",
        latestName,
      );
    },
    onStoreProgress: (p: PoolProgress<any>) => {
      if (p.completed === 1) {
        console.log(`\n${pc.bold(pc.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))}`);
        console.log(pc.bold(pc.blue("  STEP 2: SEEDING STORES")));
        console.log(pc.bold(pc.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")));
      }
      const latestStore = p.latestResult?.store?.name ?? "";
      renderProgressBar(
        p.completed,
        p.total,
        p.successCount,
        p.failureCount,
        "🏬 Stores",
        latestStore,
      );
    },
    onProductProgress: (p: PoolProgress<any>) => {
      if (p.completed === 1) {
        console.log(`\n${pc.bold(pc.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))}`);
        console.log(pc.bold(pc.cyan("  STEP 3: SEEDING PRODUCTS")));
        console.log(pc.bold(pc.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")));
      }
      const latestProd = p.latestResult?.product?.name ?? "";
      renderProgressBar(
        p.completed,
        p.total,
        p.successCount,
        p.failureCount,
        "📦 Products",
        latestProd,
      );
    },
  });

  // Summary Report
  const totalCreated = results.users.length + results.stores.length + results.products.length;
  const totalErrors =
    results.userErrors.length + results.storeErrors.length + results.productErrors.length;
  const elapsedSec = (results.durationMs / 1000).toFixed(2);
  const throughput =
    results.durationMs > 0 ? (totalCreated / (results.durationMs / 1000)).toFixed(1) : "0";

  console.log(`\n${pc.bold(pc.green("═══════════════════════════════════════════════════════"))}`);
  console.log(pc.bold(pc.green("            🎉 SEEDING COMPLETED!")));
  console.log(pc.bold(pc.green("═══════════════════════════════════════════════════════")));

  console.log(`\n${pc.bold("📊 Summary Statistics:")}`);
  console.log(
    `  • ${pc.bold("Users:")}       ${pc.green(`${results.users.length} created`)}${
      results.userErrors.length > 0 ? pc.red(` (${results.userErrors.length} failed)`) : ""
    }`,
  );
  console.log(
    `  • ${pc.bold("Stores:")}      ${pc.blue(`${results.stores.length} created`)}${
      results.storeErrors.length > 0 ? pc.red(` (${results.storeErrors.length} failed)`) : ""
    }`,
  );
  console.log(
    `  • ${pc.bold("Products:")}    ${pc.cyan(`${results.products.length} created`)}${
      results.productErrors.length > 0 ? pc.red(` (${results.productErrors.length} failed)`) : ""
    }`,
  );
  console.log(`  • ${pc.bold("Duration:")}    ${pc.yellow(`${elapsedSec}s`)} (${throughput} ops/sec)`);

  if (totalErrors > 0) {
    console.log(pc.yellow(`\n⚠️  Encountered ${totalErrors} failure(s) during seeding.`));
    const allErrors = [
      ...results.userErrors.map((e) => `[User] ${e.error.message}`),
      ...results.storeErrors.map((e) => `[Store] ${e.error.message}`),
      ...results.productErrors.map((e) => `[Product] ${e.error.message}`),
    ];
    const grouped = new Map<string, number>();
    for (const msg of allErrors) {
      grouped.set(msg, (grouped.get(msg) || 0) + 1);
    }
    console.log(pc.red("\nError breakdown:"));
    for (const [msg, count] of grouped.entries()) {
      console.log(pc.red(`  • [${count}x] ${msg}`));
    }
  }

  if (results.users.length > 0) {
    const sample = results.users[0]!;
    console.log(pc.bold("\n🔑 Sample Account for Login:"));
    console.log(`  • ${pc.bold("Display Name:")} ${sample.response.user.display_name}`);
    console.log(`  • ${pc.bold("Email:")}        ${pc.cyan(sample.userData.email)}`);
    console.log(`  • ${pc.bold("Password:")}     ${pc.cyan(sample.userData.password)}`);
  }
  console.log();
}

main().catch((err) => {
  console.error(pc.red("\n✖ Fatal seeding error:"));
  console.error(err);
  process.exit(1);
});
