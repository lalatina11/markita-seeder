import type {
  ApiResponse,
  CreateProductResponse,
} from "../lib/types/api-response";
import {
  createProductSchema,
  type CreateProductSchemaType,
} from "../lib/validation/product";
import { generateProductData } from "./mock-data";
import type { SeedStoreResult } from "./store-seeder";
import {
  runConcurrentPool,
  type PoolOptions,
  type PoolProgress,
  type PoolResult,
} from "./task-pool";

export { generateProductData };

/**
 * Creates a product in a store by calling POST /api/product
 */
export const createProduct = async (
  data: CreateProductSchemaType,
  access_token: string,
): Promise<ApiResponse<CreateProductResponse>> => {
  // Validate data before sending
  createProductSchema.parse(data);

  const res = await fetch(`${process.env.BASE_URL}/api/product`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });

  const json = (await res.json()) as ApiResponse<CreateProductResponse>;

  if (!res.ok || !json.success) {
    const errorMsg = json.message || res.statusText || "Unknown error";
    throw new Error(`Failed to create product (${res.status}): ${errorMsg}`);
  }

  return json;
};

export interface SeedProductResult {
  product: CreateProductResponse;
  productData: CreateProductSchemaType;
}

interface ProductJob {
  storeId: string;
  ownerAccessToken: string;
  templateIndex: number;
}

export interface SeedProductsOptions
  extends Omit<PoolOptions<ProductJob, SeedProductResult>, "onProgress"> {
  productsPerStore?: number;
  totalProducts?: number;
  onProgress?: (progress: PoolProgress<SeedProductResult>) => void;
}

/**
 * Seeds products concurrently with connection pooling, retries, and pacing.
 */
export const seedProducts = async (
  stores: SeedStoreResult[],
  optionsOrPerStore?:
    | SeedProductsOptions
    | number,
  onProgressLegacy?: (index: number, total: number, result: SeedProductResult) => void,
): Promise<PoolResult<SeedProductResult>> => {
  if (stores.length === 0) {
    return { results: [], errors: [], successCount: 0, failureCount: 0 };
  }

  let options: SeedProductsOptions = {};

  if (typeof optionsOrPerStore === "number") {
    options = {
      productsPerStore: optionsOrPerStore,
      onProgress: (p) => {
        if (p.latestResult) {
          onProgressLegacy?.(p.completed, p.total, p.latestResult);
        }
      },
    };
  } else if (optionsOrPerStore) {
    options = optionsOrPerStore;
  }

  // Build the list of jobs distributed across stores
  const jobs: ProductJob[] = [];

  if (options.totalProducts !== undefined && options.totalProducts > 0) {
    // Distribute totalProducts across all stores evenly
    const total = options.totalProducts;
    for (let i = 0; i < total; i++) {
      const store = stores[i % stores.length]!;
      jobs.push({
        storeId: store.store.id,
        ownerAccessToken: store.ownerAccessToken,
        templateIndex: i,
      });
    }
  } else {
    // Use productsPerStore (default 4)
    const perStore = options.productsPerStore ?? 4;
    let globalIdx = 0;
    for (let s = 0; s < stores.length; s++) {
      const store = stores[s]!;
      for (let p = 0; p < perStore; p++) {
        jobs.push({
          storeId: store.store.id,
          ownerAccessToken: store.ownerAccessToken,
          templateIndex: globalIdx++,
        });
      }
    }
  }

  return runConcurrentPool<ProductJob, SeedProductResult>(
    jobs,
    async (job) => {
      const productData = generateProductData(job.storeId, job.templateIndex);
      const res = await createProduct(productData, job.ownerAccessToken);
      return {
        product: res.data,
        productData,
      };
    },
    {
      concurrency: options.concurrency ?? 4,
      pacingDelayMs: options.pacingDelayMs ?? 15,
      maxRetries: options.maxRetries ?? 3,
      abortSignal: options.abortSignal,
      onProgress: options.onProgress,
    },
  );
};
