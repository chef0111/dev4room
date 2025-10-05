import { createAuthClient } from "better-auth/react";
import { usernameClient, adminClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    usernameClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    nextCookies(),
  ],
});
