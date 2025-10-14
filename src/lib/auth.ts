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

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
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

        // Check if user exists
        const existingUser = await db.query.user.findFirst({
          where: (users, { eq }) => eq(users.email, email),
        });

        if (!existingUser) {
          throw new APIError("BAD_REQUEST", {
            message: "This email is not registered.",
          });
        }

        // Check if user has password (credentials provider)
        const userAccount = await db.query.account.findFirst({
          where: (accounts, { and, eq }) =>
            and(
              eq(accounts.userId, existingUser.id),
              eq(accounts.providerId, "credential")
            ),
        });

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

        const { eq } = await import("drizzle-orm");
        await db
          .update(schema.user)
          .set({ emailVerified: true })
          .where(eq(schema.user.email, email));
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
            : "Dev4Room Admin <admin@dev4room.pro>";

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
