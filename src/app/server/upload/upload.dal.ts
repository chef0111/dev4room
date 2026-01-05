import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "@/lib/s3-client";
import { db } from "@/database/drizzle";
import { user } from "@/database/schema";
import { eq } from "drizzle-orm";

const PRESIGNED_URL_EXPIRY = 300;

export class UploadDAL {
  private static readonly presignedUrlExpiry = PRESIGNED_URL_EXPIRY;

  static async getPresignedUploadUrl(
    userId: string,
    fileName: string,
    fileType: string
  ) {
    // Generate unique file key with user ID prefix
    const fileExtension = fileName.split(".").pop() || "jpg";
    const fileKey = `avatars/${userId}/${crypto.randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: this.presignedUrlExpiry,
    });

    const publicUrl = `https:/${BUCKET_NAME}.t3.storage.dev/${fileKey}`;

    return {
      uploadUrl,
      fileKey,
      publicUrl,
    };
  }

  static async deleteObject(fileKey: string) {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(command);
  }

  static extractFileKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      // Remove leading slash and bucket name from path
      const path = urlObj.pathname;
      const match = path.match(/\/[^/]+\/(.+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  static async updateUserImage(userId: string, imageUrl: string | null) {
    const [updatedUser] = await db
      .update(user)
      .set({ image: imageUrl })
      .where(eq(user.id, userId))
      .returning();

    return updatedUser;
  }

  static async getUserImage(userId: string): Promise<string | null> {
    const result = await db
      .select({ image: user.image })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return result[0]?.image ?? null;
  }
}

export const getPresignedUploadUrl = (
  ...args: Parameters<typeof UploadDAL.getPresignedUploadUrl>
) => UploadDAL.getPresignedUploadUrl(...args);
export const deleteObject = (
  ...args: Parameters<typeof UploadDAL.deleteObject>
) => UploadDAL.deleteObject(...args);
export const extractFileKeyFromUrl = (
  ...args: Parameters<typeof UploadDAL.extractFileKeyFromUrl>
) => UploadDAL.extractFileKeyFromUrl(...args);
export const updateUserImage = (
  ...args: Parameters<typeof UploadDAL.updateUserImage>
) => UploadDAL.updateUserImage(...args);
export const getUserImage = (
  ...args: Parameters<typeof UploadDAL.getUserImage>
) => UploadDAL.getUserImage(...args);
