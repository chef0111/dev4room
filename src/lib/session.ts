"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { cache } from "react";

export const getServerSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});
