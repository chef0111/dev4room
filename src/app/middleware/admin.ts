import { base } from "@/app/middleware";
import { auth } from "@/lib/auth";
import { ORPCError } from "@orpc/server";

export const adminMiddleware = base.middleware(async ({ context, next }) => {
  const sessionData = await auth.api.getSession({
    headers: context.headers,
    query: {
      disableCookieCache: true,
    },
  });

  if (!sessionData?.session || !sessionData?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  // Check if user has admin role
  if (sessionData.user.role !== "admin") {
    throw new ORPCError("FORBIDDEN", {
      message: "Admin access required",
    });
  }

  return next({
    context: {
      session: sessionData.session,
      user: sessionData.user,
    },
  });
});

export const admin = base.use(adminMiddleware);
