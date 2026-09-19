import type { ApiResponse, RegisterResponse } from "../lib/types/api-response";
import { registerSchema, type RegisterSchemaType } from "../lib/validation/user";
import { generateUserData } from "./mock-data";

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

/**
 * Seeds multiple users sequentially
 */
export const seedUsers = async (
  count = 5,
  onProgress?: (index: number, total: number, result: SeedUserResult) => void,
): Promise<SeedUserResult[]> => {
  const users: SeedUserResult[] = [];

  for (let i = 0; i < count; i++) {
    const userData = generateUserData();
    const res = await createUser(userData);
    const result: SeedUserResult = {
      response: res.data,
      userData,
    };
    users.push(result);
    onProgress?.(i + 1, count, result);
  }

  return users;
};
