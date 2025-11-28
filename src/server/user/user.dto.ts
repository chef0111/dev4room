import "server-only";
import z from "zod";

export const UsersSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." }),
  email: z.email({ message: "Invalid email address." }),
  image: z.url({ message: "Invalid image URL." }).nullable(),
  role: z.string().nullable(),
});

// Output schema for list users
export const UsersListOutputSchema = z.object({
  users: z.array(UsersSchema),
  totalUsers: z.number().int().min(0),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalPages: z.number().int().min(0),
});

export type UsersDTO = z.infer<typeof UsersSchema>;
export type UsersListOutput = z.infer<typeof UsersListOutputSchema>;
