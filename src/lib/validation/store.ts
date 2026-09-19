// create store data needs header authorization bearer token

import z from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(5).trim(),
  avatar: z.string().trim(),
  banner: z.string().trim(),
  address: z.string().trim(),
  city: z.string().trim(),
});

export type CreateStoreSchemaType = z.infer<typeof createStoreSchema>;
