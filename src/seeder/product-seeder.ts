import type {
  ApiResponse,
  CreateProductResponse,
} from "../lib/types/api-response";
import type { CreateProductSchemaType } from "../lib/validation/product";

const createProduct = async (
  data: CreateProductSchemaType,
  access_token: string,
): Promise<ApiResponse<CreateProductResponse>> => {
  const res = await fetch(`${process.env.BASE_URL}/api/product`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  return (await res.json()) as ApiResponse<CreateProductResponse>;
};
