import z from "zod";

const NAME_REGEX = /^[^\d!@#$%^&*()_+=\[\]{};':"\\|,.<>?/`~]+$/;

export const PasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(100, { message: "Password cannot exceed 100 characters." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character.",
  });

export const LoginSchema = z.object({
  email: z
    .email({ message: "Please provide a valid email address." })
    .min(1, { message: "Email is required." }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password must not exceed 100 characters." }),
});

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required." })
      .max(50, { message: "Name cannot exceed 50 characters." })
      .regex(NAME_REGEX, {
        message: "Name can only contain letters and spaces.",
      }),

    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long." })
      .max(30, { message: "Username cannot exceed 30 characters." })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores.",
      }),

    email: z
      .email({ message: "Please provide a valid email address." })
      .min(1, { message: "Email is required!" }),

    password: PasswordSchema,

    confirmPassword: z.string().min(1, { message: "Please confirm password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z
    .email({ message: "Please provide a valid email address." })
    .min(1, { message: "Email is required." }),
});

export const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z.string().min(1, { message: "Please confirm password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const OTPSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Your one-time password must be 6 characters." }),
});

export const QuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 10 characters long." })
    .max(100, { message: "Title cannot exceed 100 characters." }),

  content: z
    .string()
    .min(20, { message: "Content must be at least 20 characters long." }),

  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag cannot be empty." })
        .max(20, { message: "Tag cannot exceed 20 characters." }),
    )
    .min(1, { message: "At least one tag is required." })
    .max(5, { message: "You can add a maximum of 5 tags." }),
});

export const QueryParamsSchema = z.object({
  page: z.number().int().min(1).default(1).optional(),
  pageSize: z.number().int().min(1).max(100).default(10).optional(),
  query: z.string().optional(),
  filter: z.string().optional(),
});
