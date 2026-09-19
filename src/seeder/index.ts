export * from "./user-seeder";
export * from "./store-seeder";
export * from "./product-seeder";
export * from "./mock-data";
export * from "./task-pool";

import { seedUsers, type SeedUserResult } from "./user-seeder";
import { seedStores, type SeedStoreResult } from "./store-seeder";
import { seedProducts, type SeedProductResult } from "./product-seeder";
import type { PoolProgress } from "./task-pool";

export interface SeederOptions {
  usersCount?: number;
  storesCount?: number;
  totalProducts?: number;
  productsPerStore?: number;
  concurrency?: number;
  pacingDelayMs?: number;
  maxRetries?: number;
  abortSignal?: AbortSignal;
  onUserProgress?: (progress: PoolProgress<SeedUserResult>) => void;
  onStoreProgress?: (progress: PoolProgress<SeedStoreResult>) => void;
  onProductProgress?: (progress: PoolProgress<SeedProductResult>) => void;
}

export interface SeederResult {
  users: SeedUserResult[];
  stores: SeedStoreResult[];
  products: SeedProductResult[];
  userErrors: Array<{ index: number; error: Error }>;
  storeErrors: Array<{ index: number; error: Error }>;
  productErrors: Array<{ index: number; error: Error }>;
  durationMs: number;
}

/**
 * High-level orchestrator that executes the entire seeding flow with
 * connection pooling, exponential backoff retries, and pacing.
 */
export async function runSeeder(options: SeederOptions = {}): Promise<SeederResult> {
  const {
    usersCount = 5,
    storesCount = 5,
    totalProducts,
    productsPerStore,
    concurrency = 4,
    pacingDelayMs = 15,
    maxRetries = 3,
    abortSignal,
    onUserProgress,
    onStoreProgress,
    onProductProgress,
  } = options;

  const startTime = Date.now();

  // 1. Seed Users
  const userResult = await seedUsers(usersCount, {
    concurrency,
    pacingDelayMs,
    maxRetries,
    abortSignal,
    onProgress: onUserProgress,
  });

  if (userResult.results.length === 0) {
    return {
      users: [],
      stores: [],
      products: [],
      userErrors: userResult.errors,
      storeErrors: [],
      productErrors: [],
      durationMs: Date.now() - startTime,
    };
  }

  // 2. Seed Stores for successful users
  const storeResult = await seedStores(userResult.results, {
    maxStores: storesCount,
    concurrency,
    pacingDelayMs,
    maxRetries,
    abortSignal,
    onProgress: onStoreProgress,
  });

  if (storeResult.results.length === 0) {
    return {
      users: userResult.results,
      stores: [],
      products: [],
      userErrors: userResult.errors,
      storeErrors: storeResult.errors,
      productErrors: [],
      durationMs: Date.now() - startTime,
    };
  }

  // 3. Seed Products across successful stores
  const productResult = await seedProducts(storeResult.results, {
    totalProducts,
    productsPerStore,
    concurrency,
    pacingDelayMs,
    maxRetries,
    abortSignal,
    onProgress: onProductProgress,
  });

  const durationMs = Date.now() - startTime;

  return {
    users: userResult.results,
    stores: storeResult.results,
    products: productResult.results,
    userErrors: userResult.errors,
    storeErrors: storeResult.errors,
    productErrors: productResult.errors,
    durationMs,
  };
}
