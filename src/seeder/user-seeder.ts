import type { ApiResponse, RegisterResponse } from "../lib/types/api-response";
import { registerSchema, type RegisterSchemaType } from "../lib/validation/user";
import { generateUserData } from "./mock-data";
import {
  runConcurrentPool,
  type PoolOptions,
  type PoolProgress,
  type PoolResult,
} from "./task-pool";

export { generateUserData };

/**
 * Creates a single user by calling POST /api/auth/sign-up
 */
export const createUser = async (
  data: RegisterSchemaType,
): Promise<ApiResponse<RegisterResponse>> => {
  // Validate data before sending
  registerSchema.parse(data);

  const res = await fetch(`${process.env.BASE_URL}/api/auth/sign-up`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });

  const json = (await res.json()) as ApiResponse<RegisterResponse>;

  if (!res.ok || !json.success) {
    const errorMsg = json.message || res.statusText || "Unknown error";
    throw new Error(`Failed to create user (${res.status}): ${errorMsg}`);
  }

  return json;
};

export interface SeedUserResult {
  response: RegisterResponse;
  userData: RegisterSchemaType;
}

export interface SeedUsersOptions
  extends Omit<PoolOptions<number, SeedUserResult>, "onProgress"> {
  onProgress?: (progress: PoolProgress<SeedUserResult>) => void;
}

/**
 * Seeds multiple users concurrently with connection pooling, retries, and pacing.
 */
export const seedUsers = async (
  count = 5,
  optionsOrProgress?:
    | SeedUsersOptions
    | ((index: number, total: number, result: SeedUserResult) => void),
): Promise<PoolResult<SeedUserResult>> => {
  const options: SeedUsersOptions =
    typeof optionsOrProgress === "function"
      ? {
          onProgress: (p) => {
            if (p.latestResult) {
              optionsOrProgress(p.completed, p.total, p.latestResult);
            }
          },
        }
      : optionsOrProgress || {};

  const indices = Array.from({ length: count }, (_, i) => i);

  return runConcurrentPool<number, SeedUserResult>(
    indices,
    async (index) => {
      const userData = generateUserData(index);
      const res = await createUser(userData);
      return {
        response: res.data,
        userData,
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
