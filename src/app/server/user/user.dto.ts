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

// input Schemas - the input contract for incoming changes
// includes fields users are allowed to change. 
// made optional so it supports partial updates. 
export const UpdateProfileInputSchema = z.object({
  name: z
    .string()
    .min(1, {message: "Name is required." })
    .optional(),  
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    })
    .optional(), 
  image: z
    .url({ message: "Image must be a valid URL." })
    .nullable()
    .optional(), 
  bio: z
    .string()
    .max(500, { message: "Bio cannot exceed 500 characters."})
    .nullable()
    .optional(), 
  location: z
    .string()
    .max(100, { message: "Location cannot exceed 100 characters." })
    .nullable()
    .optional(),
  portfolio: z
    .url({ message: "Porfolio must be a valid URL."})
    .nullable()
    .optional(),
});

// shape of a full profile
// adds profile fields 
// more profile fields (bio, location, portfolio) + system fields (reputation, createdAt).
// define it once and reuse it everywhere (API returns a profile -> validate against UserProfileSchema).
// database query returns data -> map to UserProfileSchema 
export const UserProfileSchema = UserSchema.extend({
  bio: z.string().nullable(),
  location: z.string().nullable(),
  portfolio: z.string().nullable(),
  reputation: z.number().int().min(0),
  createdAt: z.date(),
});

// response envelope - wraps the updated profile
// keeps response shape consistent with other endpoints 
export const UpdateProfileOutputSchema = z.object({
  user: UserProfileSchema, 
});

// Types
export type UserDTO = z.infer<typeof UserSchema>;
export type UserListOutput = z.infer<typeof UserListOutputSchema>;

export type UserProfileDTO = z.infer<typeof UserProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;
export type UpdateProfileOutput = z.infer<typeof UpdateProfileOutputSchema>; 