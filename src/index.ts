import pc from "picocolors";
import { runSeeder } from "./seeder";

function parseArgs() {
  const args = process.argv.slice(2);
  let usersCount = 5;
  let storesCount = 5;
  let productsPerStore = 4;

  for (const arg of args) {
    if (arg === "--help" || arg === "-h") {
      console.log(`
${pc.bold(pc.cyan("Markita Database Seeder CLI"))}

${pc.bold("Usage:")}
  bun run src/index.ts [options]

${pc.bold("Options:")}
  --users=<num>       Number of users to seed (default: 5)
  --stores=<num>      Number of stores to seed (default: 5)
  --products=<num>    Number of products per store (default: 4)
  --help, -h          Show this help message

${pc.bold("Environment Variables:")}
  BASE_URL            Markita server base URL (defined in .env)
`);
      process.exit(0);
    }

    const [key, value] = arg.split("=");
    if (key === "--users" && value) {
      usersCount = parseInt(value, 10) || usersCount;
    } else if (key === "--stores" && value) {
      storesCount = parseInt(value, 10) || storesCount;
    } else if (key === "--products" && value) {
      productsPerStore = parseInt(value, 10) || productsPerStore;
    }
  }

  return { usersCount, storesCount, productsPerStore };
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

async function main() {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    console.error(pc.red("✖ BASE_URL is not defined in .env"));
    process.exit(1);
  }

  const { usersCount, storesCount, productsPerStore } = parseArgs();

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

  console.log(`${pc.cyan("ℹ Target Server:")} ${pc.bold(baseUrl)}`);
  console.log(
    `${pc.cyan("ℹ Configuration:")} ${pc.bold(
      `${usersCount} users, ${storesCount} stores, ${productsPerStore} products/store (~${
        storesCount * productsPerStore
      } products total)`,
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

  console.log(
    pc.bold(pc.yellow("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")),
  );
  console.log(pc.bold(pc.yellow("  STEP 1: SEEDING USERS")));
  console.log(
    pc.bold(pc.yellow("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")),
  );

  const results = await runSeeder({
    usersCount,
    storesCount,
    productsPerStore,
    onUserProgress: (current, total, result) => {
      const user = result.response.user;
      console.log(
        `  ${pc.gray(`[${current}/${total}]`)} ${pc.green("👤")} ${pc.bold(
          user.display_name,
        )} ${pc.dim(`(${user.email})`)}`,
      );
    },
    onStoreProgress: (current, total, result) => {
      if (current === 1) {
        console.log(
          `\n${pc.bold(pc.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))}`,
        );
        console.log(pc.bold(pc.blue("  STEP 2: SEEDING STORES")));
        console.log(
          pc.bold(
            pc.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
          ),
        );
      }
      const store = result.store;
      console.log(
        `  ${pc.gray(`[${current}/${total}]`)} ${pc.blue("🏬")} ${pc.bold(
          store.name,
        )} ${pc.dim(`• ${store.city}`)}`,
      );
    },
    onProductProgress: (current, total, result) => {
      if (current === 1) {
        console.log(
          `\n${pc.bold(pc.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))}`,
        );
        console.log(pc.bold(pc.cyan("  STEP 3: SEEDING PRODUCTS")));
        console.log(
          pc.bold(
            pc.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
          ),
        );
      }
      const prod = result.product;
      console.log(
        `  ${pc.gray(`[${current}/${total}]`)} ${pc.cyan("📦")} ${pc.bold(
          prod.name,
        )} ${pc.yellow(`(${formatRupiah(prod.price)})`)} ${pc.dim(`→ Store ID: ${prod.store_id.slice(0, 8)}...`)}`,
      );
    },
  });

  // Summary Report
  console.log(
    `\n${pc.bold(pc.green("═══════════════════════════════════════════════════════"))}`,
  );
  console.log(
    pc.bold(pc.green("            🎉 SEEDING COMPLETED SUCCESSFULLY!")),
  );
  console.log(
    pc.bold(
      pc.green("═══════════════════════════════════════════════════════"),
    ),
  );

  console.log(`\n${pc.bold("📊 Summary Statistics:")}`);
  console.log(
    `  • ${pc.bold("Users created:")}    ${pc.green(results.users.length.toString())}`,
  );
  console.log(
    `  • ${pc.bold("Stores created:")}   ${pc.blue(results.stores.length.toString())}`,
  );
  console.log(
    `  • ${pc.bold("Products created:")} ${pc.cyan(results.products.length.toString())}`,
  );
  console.log(
    `  • ${pc.bold("Time elapsed:")}     ${pc.yellow(
      `${(results.durationMs / 1000).toFixed(2)}s`,
    )}\n`,
  );

  console.log(pc.bold("🔑 Sample Login Account for Testing:"));
  if (results.users.length > 0) {
    const sample = results.users[0]!;
    console.log(
      `  • ${pc.bold("Display Name:")} ${sample.response.user.display_name}`,
    );
    console.log(
      `  • ${pc.bold("Email:")}        ${pc.cyan(sample.userData.email)}`,
    );
    console.log(
      `  • ${pc.bold("Password:")}     ${pc.cyan(sample.userData.password)}`,
    );
  }
  console.log();
}

main().catch((err) => {
  console.error(pc.red("\n✖ Seeding failed with an error:"));
  console.error(err);
  process.exit(1);
});
