import type {
  ApiResponse,
  CreateStoreResponse,
} from "../lib/types/api-response";
import {
  createStoreSchema,
  type CreateStoreSchemaType,
} from "../lib/validation/store";
import { generateStoreData } from "./mock-data";
import type { SeedUserResult } from "./user-seeder";
import {
  runConcurrentPool,
  type PoolOptions,
  type PoolProgress,
  type PoolResult,
} from "./task-pool";

export { generateStoreData };

/**
 * Creates a store for an authenticated user by calling POST /api/store
 */
export const createStore = async (
  data: CreateStoreSchemaType,
  access_token: string,
): Promise<ApiResponse<CreateStoreResponse>> => {
  // Validate data before sending
  createStoreSchema.parse(data);

  const res = await fetch(`${process.env.BASE_URL}/api/store`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });

  const json = (await res.json()) as ApiResponse<CreateStoreResponse>;

  if (!res.ok || !json.success) {
    const errorMsg = json.message || res.statusText || "Unknown error";
    throw new Error(`Failed to create store (${res.status}): ${errorMsg}`);
  }

  return json;
};

export interface SeedStoreResult {
  store: CreateStoreResponse;
  storeData: CreateStoreSchemaType;
  ownerAccessToken: string;
}

export interface SeedStoresOptions
  extends Omit<PoolOptions<SeedUserResult, SeedStoreResult>, "onProgress"> {
  maxStores?: number;
  onProgress?: (progress: PoolProgress<SeedStoreResult>) => void;
}

/**
 * Seeds stores concurrently with connection pooling, retries, and pacing.
 */
export const seedStores = async (
  users: SeedUserResult[],
  optionsOrProgress?:
    | SeedStoresOptions
    | ((index: number, total: number, result: SeedStoreResult) => void),
): Promise<PoolResult<SeedStoreResult>> => {
  const options: SeedStoresOptions =
    typeof optionsOrProgress === "function"
      ? {
          onProgress: (p) => {
            if (p.latestResult) {
              optionsOrProgress(p.completed, p.total, p.latestResult);
            }
          },
        }
      : optionsOrProgress || {};

  const maxStores = options.maxStores ?? 5;
  const targetUsers = users.slice(0, Math.min(users.length, maxStores));

  return runConcurrentPool<SeedUserResult, SeedStoreResult>(
    targetUsers,
    async (user, index) => {
      const storeData = generateStoreData(index);
      const res = await createStore(storeData, user.response.access_token);
      return {
        store: res.data,
        storeData,
        ownerAccessToken: user.response.access_token,
      };
    },
    {
      concurrency: options.concurrency ?? 3,
      pacingDelayMs: options.pacingDelayMs ?? 20,
      maxRetries: options.maxRetries ?? 3,
      abortSignal: options.abortSignal,
      onProgress: options.onProgress,
    },
  );
};
