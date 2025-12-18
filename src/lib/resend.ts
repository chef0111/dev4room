import "server-only";

import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is required");
}
export const resend = new Resend(process.env.RESEND_API_KEY as string);
