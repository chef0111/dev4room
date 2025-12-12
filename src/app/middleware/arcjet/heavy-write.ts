import arcjet, { slidingWindow } from "@/lib/arcjet";
import { base } from "@/app/middleware";
import { User } from "@/lib/auth";

const buildStandardAj = () =>
  arcjet.withRule(
    slidingWindow({
      mode: "LIVE",
      interval: "1m",
      max: 3,
    }),
  );

export const heavyWriteSecurityMiddleware = base
  .$context<{ request?: Request; user: User }>()
  .middleware(async ({ context, next, errors }) => {
    if (!context.request) {
      return next();
    }

    const decision = await buildStandardAj().protect(context.request, {
      userId: context.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        throw errors.RATE_LIMITED({
          message: "Too many requests. Please try again later.",
        });

      throw errors.RATE_LIMITED({
        message: "Request blocked!",
      });
    }

    return next();
  });
