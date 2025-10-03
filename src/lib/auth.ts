import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database/drizzle";
import { schema } from "@/database/schema";
import { username, admin } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { PasswordSchema } from "./validations";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (
        context.path === "/sign-up/email" ||
        context.path === "/reset-password" ||
        context.path === "/change-password"
      ) {
        const password = context.body.password || context.body.newPassword;
        const { error } = PasswordSchema.safeParse(password);

        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough",
          });
        }
      }
    }),
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300,
    },
  },
  trustedOrigins: process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(",").map((origin) => origin.trim())
    : ["http://localhost:3000"],
  plugins: [username(), admin(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
