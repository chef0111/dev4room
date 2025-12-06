import z from "zod";  
import { base } from "@/app/middleware";
import { getUsers } from "@/app/server/user/user.dal";
import { UserListOutputSchema } from "@/app/server/user/user.dto";
import { QueryParamsSchema } from "@/lib/validations";
import { authorized } from "@/app/middleware/auth"; 
import {
  getUserById,
  updateUserProfile,
} from "@/app/server/user/user.dal";
import {
  UpdateProfileInputSchema, 
  UpdateProfileOutputSchema, 
  UserProfileSchema,
} from "@/app/server/user/user.dto"
import { ORPCError } from "@orpc/client";


export const listUsers = base
  .route({
    method: "GET",
    path: "/user",
    summary: "List Users",
    tags: ["Users"],
  })
  .input(QueryParamsSchema)
  .output(UserListOutputSchema)
  .handler(async ({ input }) => {
    const result = await getUsers(input);
    return result;
  });

  // GET user profile by ID (public access)
  export const getSpecificProfile = base 
    .route({
      method: "GET", 
      path: "/user/{userId}", 
      summary: "Get User Profile", 
      tags: ["Users"],
    })
    .input(z.object({ userId: z.string() }))
    .output(UserProfileSchema)
    .handler(async ({ input }) => {
      const profile = await getUserById(input.userId); 

      // if profile not exist 
      if (!profile) {
        throw new ORPCError("NOT_FOUND", { message: "User not found" });
      }

      return profile; 
    }); 

  // PUT update profile (after authencicated)
  export const updateSpecificProfile = authorized
    .route({
      method: "PUT",
      path: "/user/profile",
      summary: "Update User Profile", 
      tags: ["Users"],
    })
    .input(UpdateProfileInputSchema)
    .output(UpdateProfileOutputSchema)
    .handler(async ({ input, context }) => {
      const userId = context.user.id; 

      // Ensure at least one field is provided
      if (Object.keys(input).length === 0) {
        throw new ORPCError("BAD_REQUEST", {
          message: "At least one field is required for update",
        });
      }

      try {
        const updatedUser = await updateUserProfile(userId, input);
        return { user: updatedUser }; 
      } catch (error) {
        if (error instanceof Error && error.message === "Username already taken") {
          throw new ORPCError("BAD_REQUEST", {
            message: "Username is already taken", 
          });
        }
        throw new ORPCError("INTERNAL_SERVER_ERROR"); 
      }
    }) 
