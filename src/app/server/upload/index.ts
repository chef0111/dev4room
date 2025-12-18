import { authorized } from "@/app/middleware/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { writeSecurityMiddleware } from "@/app/middleware/arcjet/write";
import {
  GetPresignedUrlInputSchema,
  PresignedUrlOutputSchema,
  ConfirmUploadInputSchema,
  UploadResultSchema,
} from "./upload.dto";
import {
  getPresignedUploadUrl,
  getUserImage,
  deleteObject,
  extractFileKeyFromUrl,
} from "./upload.dal";
import { heavyWriteSecurityMiddleware } from "@/app/middleware/arcjet/heavy-write";
import { auth } from "@/lib/auth";

export const getUploadUrl = authorized
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/upload/presigned-url",
    summary: "Get Presigned URL for Upload",
    description: "Generate a presigned URL for uploading a file to S3",
    tags: ["Upload"],
  })
  .input(GetPresignedUrlInputSchema)
  .output(PresignedUrlOutputSchema)
  .handler(async ({ input, context }) => {
    const { user } = context;
    const { fileName, fileType } = input;

    const result = await getPresignedUploadUrl(user.id, fileName, fileType);

    return result;
  });

export const confirmUpload = authorized
  .use(writeSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/upload/confirm",
    summary: "Confirm Upload",
    description: "Update user's image URL after successful upload to S3",
    tags: ["Upload"],
  })
  .input(ConfirmUploadInputSchema)
  .output(UploadResultSchema)
  .handler(async ({ input, context }) => {
    const { user } = context;
    const { imageUrl } = input;

    // Delete old image if exists
    const currentImage = await getUserImage(user.id);
    if (currentImage) {
      const oldKey = extractFileKeyFromUrl(currentImage);
      if (oldKey) {
        try {
          await deleteObject(oldKey);
        } catch (error) {
          console.error("Failed to delete old image:", error);
        }
      }
    }

    await auth.api.updateUser({
      headers: context.request!.headers,
      body: {
        image: imageUrl,
      },
    });

    revalidateTag(`user:${user.id}`, "max");
    revalidatePath(`/profile/edit`);
    revalidatePath(`/profile/${user.id}`);

    return {
      success: true,
      imageUrl,
    };
  });

export const removeImage = authorized
  .use(writeSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "DELETE",
    path: "/upload/image",
    summary: "Remove Image",
    description: "Remove user's profile image from S3 and database",
    tags: ["Upload"],
  })
  .output(UploadResultSchema)
  .handler(async ({ context }) => {
    const { user } = context;

    // Get current image URL
    const currentImage = await getUserImage(user.id);
    if (currentImage) {
      const fileKey = extractFileKeyFromUrl(currentImage);
      if (fileKey) {
        try {
          await deleteObject(fileKey);
        } catch (error) {
          console.error("Failed to delete image from S3:", error);
        }
      }
    }

    await auth.api.updateUser({
      headers: context.request!.headers,
      body: {
        image: null,
      },
    });

    revalidateTag(`user:${user.id}`, "max");
    revalidatePath(`/profile/edit`);
    revalidatePath(`/profile/${user.id}`);

    return {
      success: true,
      imageUrl: null,
    };
  });
