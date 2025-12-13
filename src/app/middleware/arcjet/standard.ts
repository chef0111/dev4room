import arcjet, { detectBot, shield } from "@/lib/arcjet";
import { base } from "@/app/middleware";
import { User } from "@/lib/auth";

const buildStandardAj = () =>
  arcjet
    .withRule(
      shield({
        mode: "LIVE",
      })
    )
    .withRule(
      detectBot({
        mode: "LIVE",
        allow: [
          "CATEGORY:SEARCH_ENGINE",
          "CATEGORY:PREVIEW",
          "CATEGORY:MONITOR",
        ],
      })
    );

export const standardSecurityMiddleware = base
  .$context<{ request?: Request; user: User }>()
  .middleware(async ({ context, next, errors }) => {
    if (!context.request) {
      return next();
    }

    const decision = await buildStandardAj().protect(context.request, {
      userId: context.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isBot())
        throw errors.FORBIDDEN({
          message: "Automated traffic blocked.",
        });

      if (decision.reason.isShield())
        throw errors.FORBIDDEN({
          message: "Request blocked by security policy.",
        });

      throw errors.FORBIDDEN({
        message: "Request blocked!",
      });
    }

    return next();
  });
