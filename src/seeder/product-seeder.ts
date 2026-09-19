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

/**
 * Seeds products across all provided stores
 */
export const seedProducts = async (
  stores: SeedStoreResult[],
  productsPerStore = 4,
  onProgress?: (index: number, total: number, result: SeedProductResult) => void,
): Promise<SeedProductResult[]> => {
  const products: SeedProductResult[] = [];
  const totalProducts = stores.length * productsPerStore;
  let globalIndex = 0;

  for (let storeIdx = 0; storeIdx < stores.length; storeIdx++) {
    const storeResult = stores[storeIdx]!;

    for (let p = 0; p < productsPerStore; p++) {
      const templateIndex = storeIdx * productsPerStore + p;
      const productData = generateProductData(storeResult.store.id, templateIndex);
      const res = await createProduct(productData, storeResult.ownerAccessToken);

      const result: SeedProductResult = {
        product: res.data,
        productData,
      };

      products.push(result);
      globalIndex++;
      onProgress?.(globalIndex, totalProducts, result);
    }
  }

  return products;
};
