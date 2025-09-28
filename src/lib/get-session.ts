import { headers } from "next/headers";
import { auth } from "./auth";
import { cache } from "react";

export const getServerSession = cache(async () => {
  console.log("Get server session");
  return await auth.api.getSession({ headers: await headers() });
});
