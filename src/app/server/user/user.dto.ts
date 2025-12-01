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

// Query params schema for listing users
export const UserQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  query: z.string().optional(),
  filter: z.enum(["newest", "oldest", "popular"]).optional(),
});

// Output schema for list users
export const UsersListOutputSchema = z.object({
  users: z.array(UsersSchema),
  totalUsers: z.number().int().min(0),
});

export type UsersDTO = z.infer<typeof UsersSchema>;
export type UserQueryParams = z.infer<typeof UserQuerySchema>;
export type UsersListOutput = z.infer<typeof UsersListOutputSchema>;
