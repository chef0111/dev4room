import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "@/lib/s3-client";
import { db } from "@/database/drizzle";
import { user } from "@/database/schema";
import { eq } from "drizzle-orm";

const PRESIGNED_URL_EXPIRY = 300;

export async function getPresignedUploadUrl(
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
    expiresIn: PRESIGNED_URL_EXPIRY,
  });

  const publicUrl = `https://${BUCKET_NAME}.t3.storage.dev/${fileKey}`;

  return {
    uploadUrl,
    fileKey,
    publicUrl,
  };
}

export async function deleteObject(fileKey: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  await s3Client.send(command);
}

export function extractFileKeyFromUrl(url: string): string | null {
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

export async function updateUserImage(userId: string, imageUrl: string | null) {
  const [updatedUser] = await db
    .update(user)
    .set({ image: imageUrl })
    .where(eq(user.id, userId))
    .returning();

  return updatedUser;
}

export async function getUserImage(userId: string): Promise<string | null> {
  const result = await db
    .select({ image: user.image })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return result[0]?.image ?? null;
}
