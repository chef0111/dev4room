import { NextRequest, NextResponse } from "next/server";
import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { router } from "@/app/server/router";

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

// Better-auth endpoints documentation
const authPaths = {
  "/api/auth/sign-up/email": {
    post: {
      tags: ["Authentication"],
      summary: "Register with Email",
      description: "Create a new account using email and password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password", "name"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  description: "User email address",
                },
                password: {
                  type: "string",
                  minLength: 8,
                  description:
                    "Password (min 8 chars, must include uppercase, lowercase, number)",
                },
                name: {
                  type: "string",
                  description: "User display name",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Registration successful, verification email sent",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: { $ref: "#/components/schemas/User" },
                  session: { $ref: "#/components/schemas/Session" },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid input or email already exists",
        },
        "429": {
          description: "Rate limit exceeded",
        },
      },
    },
  },
  "/api/auth/sign-in/email": {
    post: {
      tags: ["Authentication"],
      summary: "Login with Email",
      description: "Authenticate using email and password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
                password: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: { $ref: "#/components/schemas/User" },
                  session: { $ref: "#/components/schemas/Session" },
                },
              },
            },
          },
        },
        "401": {
          description: "Invalid credentials",
        },
        "403": {
          description: "Email not verified",
        },
      },
    },
  },
  "/api/auth/sign-in/social": {
    post: {
      tags: ["Authentication"],
      summary: "Social Login",
      description: "Initiate OAuth login with Google or GitHub",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["provider", "callbackURL"],
              properties: {
                provider: {
                  type: "string",
                  enum: ["google", "github"],
                  description: "OAuth provider",
                },
                callbackURL: {
                  type: "string",
                  description: "URL to redirect after authentication",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Returns OAuth redirect URL",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  url: {
                    type: "string",
                    description: "OAuth provider redirect URL",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/sign-out": {
    post: {
      tags: ["Authentication"],
      summary: "Sign Out",
      description: "End the current session and sign out",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Successfully signed out",
        },
      },
    },
  },
  "/api/auth/get-session": {
    get: {
      tags: ["Authentication"],
      summary: "Get Current Session",
      description: "Retrieve the current user session",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Current session data",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: { $ref: "#/components/schemas/User" },
                  session: { $ref: "#/components/schemas/Session" },
                },
              },
            },
          },
        },
        "401": {
          description: "Not authenticated",
        },
      },
    },
  },
  "/api/auth/email-otp/send-verification-otp": {
    post: {
      tags: ["Authentication"],
      summary: "Send Verification OTP",
      description: "Send a one-time password to email for verification",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "type"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
                type: {
                  type: "string",
                  enum: ["email-verification", "forget-password"],
                  description: "Purpose of the OTP",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "OTP sent successfully",
        },
        "400": {
          description: "Invalid email or user not found",
        },
        "429": {
          description: "Rate limit exceeded",
        },
      },
    },
  },
  "/api/auth/email-otp/verify-otp": {
    post: {
      tags: ["Authentication"],
      summary: "Verify OTP",
      description: "Verify the one-time password sent to email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "otp"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
                otp: {
                  type: "string",
                  description: "6-digit OTP code",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "OTP verified successfully",
        },
        "400": {
          description: "Invalid or expired OTP",
        },
      },
    },
  },
  "/api/auth/reset-password": {
    post: {
      tags: ["Authentication"],
      summary: "Reset Password",
      description: "Reset password using OTP verification",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "newPassword"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
                newPassword: {
                  type: "string",
                  minLength: 8,
                  description: "New password",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Password reset successful",
        },
        "400": {
          description: "Invalid request or weak password",
        },
      },
    },
  },
  "/api/auth/change-password": {
    post: {
      tags: ["Authentication"],
      summary: "Change Password",
      description: "Change password for authenticated user",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["currentPassword", "newPassword"],
              properties: {
                currentPassword: {
                  type: "string",
                },
                newPassword: {
                  type: "string",
                  minLength: 8,
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Password changed successfully",
        },
        "400": {
          description: "Invalid current password or weak new password",
        },
        "401": {
          description: "Not authenticated",
        },
      },
    },
  },
  "/api/auth/callback/google": {
    get: {
      tags: ["Authentication"],
      summary: "Google OAuth Callback",
      description: "Handles the OAuth callback from Google",
      parameters: [
        {
          name: "code",
          in: "query",
          required: true,
          schema: { type: "string" },
          description: "Authorization code from Google",
        },
        {
          name: "state",
          in: "query",
          schema: { type: "string" },
          description: "State parameter for CSRF protection",
        },
      ],
      responses: {
        "302": {
          description: "Redirects to application after successful auth",
        },
        "400": {
          description: "Invalid callback parameters",
        },
      },
    },
  },
  "/api/auth/callback/github": {
    get: {
      tags: ["Authentication"],
      summary: "GitHub OAuth Callback",
      description: "Handles the OAuth callback from GitHub",
      parameters: [
        {
          name: "code",
          in: "query",
          required: true,
          schema: { type: "string" },
          description: "Authorization code from GitHub",
        },
        {
          name: "state",
          in: "query",
          schema: { type: "string" },
          description: "State parameter for CSRF protection",
        },
      ],
      responses: {
        "302": {
          description: "Redirects to application after successful auth",
        },
        "400": {
          description: "Invalid callback parameters",
        },
      },
    },
  },
};

// Auth-related schemas
const authSchemas = {
  User: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      username: { type: "string" },
      image: { type: "string", nullable: true },
      bio: { type: "string", nullable: true },
      location: { type: "string", nullable: true },
      portfolio: { type: "string", nullable: true },
      reputation: { type: "number" },
      emailVerified: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  Session: {
    type: "object",
    properties: {
      id: { type: "string" },
      userId: { type: "string" },
      token: { type: "string" },
      expiresAt: { type: "string", format: "date-time" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const isSpecRequest = url.searchParams.get("spec") === "json";

  if (isSpecRequest) {
    const spec = await generator.generate(router, {
      info: {
        title: "Dev4Room API",
        version: "1.0.0",
        description:
          "Programming Q&A community API - Built for developers by developers",
        contact: {
          name: "Dev4Room Support",
          url: "https://github.com/dev4room",
        },
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          description: "Development server",
        },
      ],
      security: [
        {
          bearerAuth: [],
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Enter your JWT token",
          },
        },
      },
      tags: [
        {
          name: "Authentication",
          description: "User authentication and session management",
        },
        { name: "Questions", description: "Question management endpoints" },
        { name: "Answers", description: "Answer management endpoints" },
        { name: "Users", description: "User management endpoints" },
        { name: "Tags", description: "Tag management endpoints" },
        { name: "Votes", description: "Voting system endpoints" },
        { name: "Collections", description: "Collection (bookmark) endpoints" },
      ],
    });

    // Merge auth paths and schemas with oRPC-generated spec
    const mergedSpec = {
      ...spec,
      paths: {
        ...authPaths,
        ...spec.paths,
      },
      components: {
        ...spec.components,
        schemas: {
          ...authSchemas,
          ...spec.components?.schemas,
        },
      },
    };

    return NextResponse.json(mergedSpec);
  }

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Dev4Room API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/api/docs?spec=json"
      data-configuration='${JSON.stringify({
        theme: "purple",
        layout: "modern",
        defaultHttpClient: {
          targetKey: "javascript",
          clientKey: "fetch",
        },
        authentication: {
          preferredSecurityScheme: "bearerAuth",
          apiKey: {
            token: {
              name: "Authorization",
              value: "Bearer {token}",
            },
          },
        },
        hideDarkModeToggle: false,
        hideDownloadButton: false,
        defaultOpenAllTags: false,
        withCredentials: true,
        servers: [
          {
            url:
              (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") +
              "/api",
            description: "Development Server",
          },
        ],
      })}'
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>
`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
