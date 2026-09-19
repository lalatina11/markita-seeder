// create product need header authorization bearer token

import z from "zod";

export const createProductMediaSchema = z.object({
  media_type: z.enum(["image", "video"]),
  media_url: z.string(),
});

export type CreateProductMediaSchemaType = z.infer<
  typeof createProductMediaSchema
>;

export const createProductSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  price: z.coerce.number().min(100), // rupiah
  store_id: z.string(),
  media: z.array(createProductMediaSchema),
});

export type CreateProductSchemaType = z.infer<typeof createProductSchema>;
