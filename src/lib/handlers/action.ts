"use server";

import { treeifyError, ZodType, ZodError } from "zod";
import { flattenTree } from "./zodIssueTree";
import { UnauthorizedError, ValidationError } from "@/errors/http-errors";
import { getServerSession } from "@/lib/session";
import { db } from "@/database/drizzle";
import type { Session } from "@/lib/auth";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodType<T>;
  authorize?: boolean;
};

async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  // Check if schema is provided and validate params
  let validatedParams = params;

  if (schema && params != null) {
    try {
      validatedParams = schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        const tree = treeifyError(error);
        const fieldErrors = flattenTree(tree);

        return new ValidationError(fieldErrors);
      } else {
        return new Error("Schema validation failed");
      }
    }
  }

  // Check if the user is authorized
  let session: Session | null = null;

  if (authorize) {
    const sessionData = await getServerSession();
    session = sessionData ?? null;

    if (!session) {
      return new UnauthorizedError();
    }
  }

  return { session, params: validatedParams, db };
}

export default action;
