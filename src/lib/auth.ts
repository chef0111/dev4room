import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database/drizzle";
import { schema } from "@/database/schema";
import { username, admin, emailOTP } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { PasswordSchema } from "./validations";
import { resend } from "./resend";
import SendOTPEmail from "@/components/layout/email/SendOTPEmail";
import {
  checkUserExists,
  checkUserCredentials,
  verifyUserEmail,
  generateUniqueUsername,
  checkExistingUsername,
} from "@/server/auth/auth.action";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: async (profile) => {
        const username = await generateUniqueUsername("user");

        return {
          image: profile.picture,
          username,
          displayUsername: username,
        };
      },
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: async (profile) => {
        const existingUsername = await checkExistingUsername(profile.login);
        let username = profile.login;

        if (existingUsername) {
          username = await generateUniqueUsername("user");
        }

        return {
          image: profile.avatar_url,
          username,
          displayUsername: username,
        };
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        input: false,
        required: false,
      },
      location: {
        type: "string",
        input: false,
        required: false,
      },
      reputation: {
        type: "number",
        input: false,
        defaultValue: 0,
        required: false,
      },
      portfolio: {
        type: "string",
        input: false,
        required: false,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = PasswordSchema.safeParse(password);

        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough.",
          });
        }
      }

      // Check if email exists for forgot password flow
      if (
        ctx.path === "/email-otp/send-verification-otp" &&
        ctx.body.type === "forget-password"
      ) {
        const email = ctx.body.email;
        const existingUser = await checkUserExists(email);

        if (!existingUser) {
          throw new APIError("BAD_REQUEST", {
            message: "This email is not registered.",
          });
        }

        const userAccount = await checkUserCredentials(existingUser.id);
        if (!userAccount) {
          throw new APIError("BAD_REQUEST", {
            message:
              "This email is registered with social provider. Please use social login.",
          });
        }
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/email-otp/check-verification-otp" &&
        ctx.body.type === "email-verification"
      ) {
        const email = ctx.body.email;
        await verifyUserEmail(email);
      }

      // Handle username generation for social login users
      if (
        (ctx.path === "/callback/google" || ctx.path === "/callback/github") &&
        ctx.context?.user
      ) {
        const user = ctx.context.user;

        // Check if user already has a username
        const existingUser = await db.query.user.findFirst({
          where: eq(schema.user.id, user.id),
        });

        if (
          existingUser &&
          (!existingUser.username || existingUser.username.trim() === "")
        ) {
          // Generate a unique username based on the user's name
          const uniqueUsername = await generateUniqueUsername(
            user.name || user.email.split("@")[0],
          );

          // Update the user with the generated username
          await db
            .update(schema.user)
            .set({ username: uniqueUsername })
            .where(eq(schema.user.id, user.id));
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
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
    customRules: {
      "/sign-up/email": {
        window: 60,
        max: 5,
      },
      "/email-otp/send-verification": {
        window: 60,
        max: 5,
      },
    },
  },
  trustedOrigins: process.env.BETTER_AUTH_URL
    ? process.env.BETTER_AUTH_URL.split(",").map((origin) => origin.trim())
    : ["http://localhost:3000"],
  plugins: [
    username(),
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const sender =
          process.env.RESEND_FROM_EMAIL &&
          process.env.RESEND_FROM_EMAIL.trim().length > 0
            ? `Dev4Room Admin <${process.env.RESEND_FROM_EMAIL.trim()}>`
            : "Dev4Room Admin <onboarding@resend.dev>";

        await resend.emails.send({
          from: sender,
          to: [email],
          subject: "Dev4Room - Verify your email",
          react: SendOTPEmail({
            userEmail: email,
            otp: otp,
            expiryMinutes: Number(this.expiresIn) / 60,
          }),
        });
      },
      sendVerificationOnSignUp: true,
      allowedAttempts: 5,
      expiresIn: 300,
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
