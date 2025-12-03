import "server-only";
import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." }),
  email: z.email({ message: "Invalid email address." }),
  image: z.url({ message: "Invalid image URL." }).nullable(),
  role: z.string().nullable(),
});

// Output Schemas
export const UserListOutputSchema = z.object({
  users: z.array(UserSchema),
  totalUsers: z.number().int().min(0),
});

// Types
export type UserDTO = z.infer<typeof UserSchema>;
export type UserListOutput = z.infer<typeof UserListOutputSchema>;
