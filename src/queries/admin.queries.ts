"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/lib/orpc";

export function useAdminStats() {
  return useQuery({
    ...orpc.admin.stats.queryOptions({ input: undefined }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

interface ListUsersParams {
  search?: string;
  role?: string;
  banned?: boolean;
  limit?: number;
  offset?: number;
}

export function useAdminUsers(params: ListUsersParams = {}) {
  const { search, role, banned, limit = 20, offset = 0 } = params;

  return useQuery({
    ...orpc.admin.users.queryOptions({
      input: { search, role, banned, limit, offset },
    }),
    staleTime: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { userId: string; reason: string }) =>
      client.admin.banUser(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => client.admin.unbanUser({ userId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });
}

export function useSetUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { userId: string; role: "admin" | "user" | null }) =>
      client.admin.setRole(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => client.admin.deleteUser({ userId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });
}

export function useAdminGrowth(days: number = 90) {
  return useQuery({
    ...orpc.admin.growth.queryOptions({
      input: { days },
    }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useAdminPendingQuestions() {
  return useQuery({
    ...orpc.admin.pendingQuestions.queryOptions({
      input: undefined,
    }),
    staleTime: 1000 * 30,
  });
}

export function useApproveQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) =>
      client.admin.approveQuestion({ questionId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "pendingQuestions"],
      });
    },
  });
}

export function useRejectQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { questionId: string; reason: string }) =>
      client.admin.rejectQuestion(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "pendingQuestions"],
      });
    },
  });
}
