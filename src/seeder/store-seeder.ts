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

/**
 * Seeds stores for a list of users
 */
export const seedStores = async (
  users: SeedUserResult[],
  maxStores = 5,
  onProgress?: (index: number, total: number, result: SeedStoreResult) => void,
): Promise<SeedStoreResult[]> => {
  const stores: SeedStoreResult[] = [];
  const targetCount = Math.min(users.length, maxStores);

  for (let i = 0; i < targetCount; i++) {
    const user = users[i]!;
    const storeData = generateStoreData(i);
    const res = await createStore(storeData, user.response.access_token);

    const result: SeedStoreResult = {
      store: res.data,
      storeData,
      ownerAccessToken: user.response.access_token,
    };
    stores.push(result);
    onProgress?.(i + 1, targetCount, result);
  }

  return stores;
};
