import type {
  ApiResponse,
  CreateStoreResponse,
} from "../lib/types/api-response";
import type { CreateStoreSchemaType } from "../lib/validation/store";

export const createStore = async (
  data: CreateStoreSchemaType,
  access_token: string,
): Promise<ApiResponse<CreateStoreResponse>> => {
  const res = await fetch(`${process.env.BASE_URL}/api/store`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  return (await res.json()) as ApiResponse<CreateStoreResponse>;
};
