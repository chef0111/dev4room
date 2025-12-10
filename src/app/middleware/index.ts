import { os } from "@orpc/server";

export const base = os
  .$context<{ headers: Headers; request: Request }>()
  .errors({
    RATE_LIMITED: {
      message: "Too many requests. Please try again later.",
    },
    BAD_REQUEST: {
      message: "Bad request.",
    },
    NOT_FOUND: {
      message: "Not found.",
    },
    FORBIDDEN: {
      message: "This is forbidden.",
    },
    UNAUTHORIZED: {
      message: "You are Unauthorized.",
    },
    INTERNAL_SERVER_ERROR: {
      message: "Internal Server Error.",
    },
  });
