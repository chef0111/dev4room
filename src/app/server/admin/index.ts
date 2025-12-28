import { z } from "zod";
import { admin } from "@/app/middleware/admin";
import { authorized } from "@/app/middleware/auth";
import { auth } from "@/lib/auth";
import { standardSecurityMiddleware } from "@/app/middleware/arcjet/standard";
import { writeSecurityMiddleware } from "@/app/middleware/arcjet/write";
import {
  getPlatformStats,
  getGrowthAnalytics,
  getPendingQuestions,
  approveQuestion as approveQuestionDAL,
  rejectQuestion as rejectQuestionDAL,
  getUsers,
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
  ListPendingQuestionsInputSchema,
  ListPendingQuestionsOutputSchema,
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

export const listUsers = authorized
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
    return await getUsers({
      search: input.search,
      role: input.role,
      banned: input.banned,
      emailVerified: input.emailVerified,
      createdAfter: input.createdAfter,
      createdBefore: input.createdBefore,
      limit: input.limit,
      offset: input.offset,
    });
  });

export const banUser = authorized
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/admin/users/{userId}/ban",
    summary: "Ban User (Admin Only)",
    tags: ["Admin"],
  })
  .input(BanUserInputSchema)
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input, context }) => {
    await auth.api.setRole({
      headers: context.headers,
      body: {
        userId: input.userId,
        role: "user",
      },
    });

    await auth.api.banUser({
      headers: context.headers,
      body: {
        userId: input.userId,
        banReason: input.reason,
      },
    });

    // Revoke all sessions to force immediate logout
    await auth.api.revokeUserSessions({
      headers: context.headers,
      body: {
        userId: input.userId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  });

export const unbanUser = authorized
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/admin/users/{userId}/unban",
    summary: "Unban User (Admin Only)",
    tags: ["Admin"],
  })
  .input(UnbanUserInputSchema)
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input, context }) => {
    await auth.api.unbanUser({
      headers: context.headers,
      body: {
        userId: input.userId,
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  });

export const setUserRole = authorized
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/admin/users/{userId}/role",
    summary: "Set User Role (Admin Only)",
    tags: ["Admin"],
  })
  .input(UpdateUserRoleInputSchema)
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input, context }) => {
    await auth.api.setRole({
      headers: context.headers,
      body: {
        userId: input.userId,
        role: input.role ?? "user",
      },
    });

    // Revoke all sessions to force immediate logout
    await auth.api.revokeUserSessions({
      headers: context.headers,
      body: {
        userId: input.userId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  });

export const deleteUser = authorized
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/admin/users/{userId}/delete",
    summary: "Delete User (Admin Only)",
    tags: ["Admin"],
  })
  .input(DeleteUserInputSchema)
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input, context }) => {
    await auth.api.removeUser({
      headers: context.headers,
      body: {
        userId: input.userId,
      },
    });
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

export const listPendingQuestions = admin
  .use(standardSecurityMiddleware)
  .route({
    method: "GET",
    path: "/admin/questions/pending",
    summary: "List Pending Questions (Admin Only)",
    tags: ["Admin"],
  })
  .input(ListPendingQuestionsInputSchema)
  .output(ListPendingQuestionsOutputSchema)
  .handler(async ({ input }) => {
    return getPendingQuestions({
      search: input.search,
      status: input.status,
      limit: input.limit,
      offset: input.offset,
    });
  });

export const approveQuestion = admin
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/admin/questions/{questionId}/approve",
    summary: "Approve Pending Question (Admin Only)",
    tags: ["admin", "pendingQuestions"],
  })
  .input(z.object({ questionId: z.string() }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    await approveQuestionDAL(input.questionId);
    revalidatePath("/dashboard");
    return { success: true };
  });

export const rejectQuestion = admin
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/admin/questions/{questionId}/reject",
    summary: "Reject Pending Question (Admin Only)",
    tags: ["admin", "pendingQuestions"],
  })
  .input(
    z.object({ questionId: z.string(), reason: z.string().min(1).max(500) })
  )
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    await rejectQuestionDAL(input.questionId, input.reason);
    revalidatePath("/dashboard");
    return { success: true };
  });
