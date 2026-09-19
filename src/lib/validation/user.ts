import z from "zod";

// {
//   "email":"zoro@email.com",
//   "password": "password123",
//   "data": {
//     "display_name": "Zoro"
//   }
// }
export const registerSchema = z.object({
  email: z.email("Use a valid email"),
  password: z.string().min(8),
  data: z.object({
    display_name: z.string().min(3),
  }),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
