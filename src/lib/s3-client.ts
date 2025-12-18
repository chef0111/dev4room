import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

export const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET!;

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "auto",
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});
