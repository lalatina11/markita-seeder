export * from "./user-seeder";
export * from "./store-seeder";
export * from "./product-seeder";
export * from "./mock-data";

import { seedUsers, type SeedUserResult } from "./user-seeder";
import { seedStores, type SeedStoreResult } from "./store-seeder";
import { seedProducts, type SeedProductResult } from "./product-seeder";

export interface SeederOptions {
  usersCount?: number;
  storesCount?: number;
  productsPerStore?: number;
  onUserProgress?: (current: number, total: number, result: SeedUserResult) => void;
  onStoreProgress?: (current: number, total: number, result: SeedStoreResult) => void;
  onProductProgress?: (current: number, total: number, result: SeedProductResult) => void;
}

export interface SeederResult {
  users: SeedUserResult[];
  stores: SeedStoreResult[];
  products: SeedProductResult[];
  durationMs: number;
}

/**
 * High-level orchestrator that executes the entire seeding flow:
 * 1. Seeds Users
 * 2. Seeds Stores for those users
 * 3. Seeds Products for each created store
 */
export async function runSeeder(options: SeederOptions = {}): Promise<SeederResult> {
  const {
    usersCount = 5,
    storesCount = 5,
    productsPerStore = 4,
    onUserProgress,
    onStoreProgress,
    onProductProgress,
  } = options;

  const startTime = Date.now();

  // 1. Seed Users
  const users = await seedUsers(usersCount, onUserProgress);

  // 2. Seed Stores
  const stores = await seedStores(users, storesCount, onStoreProgress);

  // 3. Seed Products
  const products = await seedProducts(stores, productsPerStore, onProductProgress);

  const durationMs = Date.now() - startTime;

  return {
    users,
    stores,
    products,
    durationMs,
  };
}
