import { auth } from "@/lib/auth";
import ip from "@arcjet/ip";
import arcjet from "@/lib/arcjet";
import {
  ArcjetDecision,
  type BotOptions,
  type EmailOptions,
  type ProtectSignupOptions,
  type SlidingWindowRateLimitOptions,
  detectBot,
  protectSignup,
  slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const emailOptions = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const botOptions = {
  mode: "LIVE",
  allow: [], // prevents bots from submitting the form
} satisfies BotOptions;

const rateLimitOptions = {
  mode: "LIVE",
  interval: "1m",
  max: 10,
} satisfies SlidingWindowRateLimitOptions<[]>;

const signupOptions = {
  email: emailOptions,
  bots: botOptions,
  rateLimit: rateLimitOptions,
} satisfies ProtectSignupOptions<[]>;

async function protect(req: NextRequest): Promise<ArcjetDecision> {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  let userId: string;
  if (session?.user.id) {
    userId = session.user.id;
  } else {
    userId = ip(req) || "127.0.0.1"; // Fall back to local IP if none
  }

  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith("/api/auth/sign-up/email") ||
    pathname.startsWith("/api/auth/email-otp/send-verification-otp")
  ) {
    const body = await req.json();

    if (typeof body.email === "string") {
      return arcjet
        .withRule(protectSignup(signupOptions))
        .protect(req, { email: body.email, fingerprint: userId });
    } else {
      return arcjet
        .withRule(detectBot(botOptions))
        .withRule(slidingWindow(rateLimitOptions))
        .protect(req, { fingerprint: userId });
    }
  } else {
    return arcjet
      .withRule(detectBot(botOptions))
      .protect(req, { fingerprint: userId });
  }
}

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

export const POST = async (req: NextRequest) => {
  try {
    // Buffer the body first to allow multiple reads
    const bodyText = await req.text();

    // Create a new request with the buffered body for Arcjet
    const reqForArcjet = new NextRequest(req.url, {
      method: req.method,
      headers: req.headers,
      body: bodyText,
    });

    // Create a new request with the buffered body for Better Auth
    const reqForBetterAuth = new NextRequest(req.url, {
      method: req.method,
      headers: req.headers,
      body: bodyText,
    });

    const decision = await protect(reqForArcjet);

    console.log("Arcjet Decision:", {
      conclusion: decision.conclusion,
      isDenied: decision.isDenied(),
      reason: decision.reason,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        console.log("⏱️ Rate limit exceeded");
        return new Response(null, { status: 429 });
      } else if (decision.reason.isEmail()) {
        let message: string;

        if (decision.reason.emailTypes.includes("INVALID")) {
          message = "Email address format is invalid. Is there a typo?";
        } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
          message = "We do not allow disposable email addresses.";
        } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
          message =
            "Your email domain does not have an MX record. Is there a typo?";
        } else {
          message = "Invalid email.";
        }

        return Response.json({ message }, { status: 400 });
      } else {
        return new Response(null, { status: 403 });
      }
    }

    const response = await authHandlers.POST(reqForBetterAuth);
    return response;
  } catch (error) {
    throw error;
  }
};
