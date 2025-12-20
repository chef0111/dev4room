import { z } from "zod";
import { admin } from "@/app/middleware/admin";
import { standardSecurityMiddleware } from "@/app/middleware/arcjet/standard";
import { writeSecurityMiddleware } from "@/app/middleware/arcjet/write";
import {
  getPlatformStats,
  listAllUsers,
  banUserById,
  unbanUserById,
  updateUserRole,
  deleteUserById,
  getGrowthAnalytics,
} from "./admin.dal";
import {
  PlatformStatsSchema,
  ListUsersInputSchema,
  ListUsersOutputSchema,
  BanUserInputSchema,
  UnbanUserInputSchema,
  UpdateUserRoleInputSchema,
  DeleteUserInputSchema,
  GrowthAnalyticsInputSchema,
  GrowthAnalyticsOutputSchema,
} from "./admin.dto";
import { revalidatePath } from "next/cache";

export const getStats = admin
  .use(standardSecurityMiddleware)
  .route({
    method: "GET",
    path: "/admin/stats",
    summary: "Get Platform Statistics (Admin Only)",
    tags: ["Admin"],
  })
  .output(PlatformStatsSchema)
  .handler(async () => {
    return await getPlatformStats();
  });

export const listUsers = admin
  .use(standardSecurityMiddleware)
  .route({
    method: "GET",
    path: "/admin/users",
    summary: "List All Users (Admin Only)",
    tags: ["Admin"],
  })
  .input(ListUsersInputSchema)
  .output(ListUsersOutputSchema)
  .handler(async ({ input }) => {
    return await listAllUsers(input);
  });

export const banUser = admin
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/admin/users/{userId}/ban",
    summary: "Ban User (Admin Only)",
    tags: ["Admin"],
  })
  .input(BanUserInputSchema)
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    await banUserById(input.userId, input.reason);
    revalidatePath("/dashboard");
    return { success: true };
  });

export const unbanUser = admin
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/admin/users/{userId}/unban",
    summary: "Unban User (Admin Only)",
    tags: ["Admin"],
  })
  .input(UnbanUserInputSchema)
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    await unbanUserById(input.userId);
    revalidatePath("/dashboard");
    return { success: true };
  });

export const setUserRole = admin
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/admin/users/{userId}/role",
    summary: "Set User Role (Admin Only)",
    tags: ["Admin"],
  })
  .input(UpdateUserRoleInputSchema)
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    await updateUserRole(input.userId, input.role);
    revalidatePath("/dashboard");
    return { success: true };
  });

export const deleteUser = admin
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/admin/users/{userId}/delete",
    summary: "Delete User (Admin Only)",
    tags: ["Admin"],
  })
  .input(DeleteUserInputSchema)
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    await deleteUserById(input.userId);
    revalidatePath("/dashboard");
    return { success: true };
  });

export const getGrowth = admin
  .use(standardSecurityMiddleware)
  .route({
    method: "GET",
    path: "/admin/growth",
    summary: "Get Growth Analytics (Admin Only)",
    tags: ["Admin"],
  })
  .input(GrowthAnalyticsInputSchema)
  .output(GrowthAnalyticsOutputSchema)
  .handler(async ({ input }) => {
    const data = await getGrowthAnalytics(input.days);
    return { data };
  });
