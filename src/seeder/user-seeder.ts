import type { ApiResponse, RegisterResponse } from "../lib/types/api-response";
import type { RegisterSchemaType } from "../lib/validation/user";

const createUser = async (
  data: RegisterSchemaType,
): Promise<ApiResponse<RegisterResponse>> => {
  const res = await fetch(`${process.env.BASE_URL}/api/auth/sign-up`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      accept: "application/json",
    },
  });
  return (await res.json()) as ApiResponse<RegisterResponse>;
};
