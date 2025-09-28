import { createAuthClient } from "better-auth/react";
import { usernameClient, adminClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [usernameClient(), adminClient(), nextCookies()],
});
