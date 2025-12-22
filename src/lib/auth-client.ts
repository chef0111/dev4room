import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  adminClient,
  emailOTPClient,
} from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { auth } from "./auth";
import { ac, admin, moderator, user } from "@/app/server/admin/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  fetchOptions: {
    onError: async (context) => {
      const { response } = context;
      if (response.status === 429) {
        const retryAfter = response.headers.get("X-Retry-After");
        console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
      }
    },
  },
  plugins: [
    usernameClient(),
    adminClient({
      ac,
      roles: {
        admin,
        moderator,
        user,
      },
    }),
    emailOTPClient(),
    inferAdditionalFields<typeof auth>(),
    nextCookies(),
  ],
});
