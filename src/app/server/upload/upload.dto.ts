import z from "zod";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  fileType: z.string().min(1, { message: "File type is required" }),
  size: z.number().min(1, { message: "File size is required" }),
  isImage: z.boolean().optional().default(false),
});

export const GetPresignedUrlInputSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  fileType: z
    .string()
    .refine(
      (type) =>
        ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(type),
      { message: "Only JPEG, PNG, WebP, and GIF images are allowed" }
    ),
  fileSize: z
    .number()
    .max(1024 * 1024, { message: "File size must be less than 1MB" }),
});

export const PresignedUrlOutputSchema = z.object({
  uploadUrl: z.string(),
  fileKey: z.string(),
  publicUrl: z.string(),
});

export const ConfirmUploadInputSchema = z.object({
  imageUrl: z.string().url({ message: "Invalid image URL" }),
});

export const UploadResultSchema = z.object({
  success: z.boolean(),
  imageUrl: z.string().nullable(),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type GetPresignedUrlInput = z.infer<typeof GetPresignedUrlInputSchema>;
export type PresignedUrlOutput = z.infer<typeof PresignedUrlOutputSchema>;
export type ConfirmUploadInput = z.infer<typeof ConfirmUploadInputSchema>;
export type UploadResult = z.infer<typeof UploadResultSchema>;
