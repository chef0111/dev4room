import { RequestError, ValidationError } from "@/errors/http-errors";
import { NextResponse } from "next/server";
import { treeifyError, ZodError } from "zod";
import logger from "./logger";
import { flattenTree } from "./zodIssueTree";

export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined,
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    logger.error(
      { err: error },
      `${responseType.toUpperCase()} Errors: ${error.message}`,
    );

    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors,
    );
  }

  if (error instanceof ZodError) {
    const tree = treeifyError(error);
    const fieldErrors = flattenTree(tree);
    const validationError = new ValidationError(fieldErrors);

    logger.error(
      { err: error },
      `Validation Error: ${validationError.message}`,
    );

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors,
    );
  }

  if (error instanceof Error) {
    logger.error(error.message);

    return formatResponse(
      responseType,
      500,
      error.message || "Internal Server Error",
    );
  }

  logger.error("An unexpected error occurred");
  return formatResponse(responseType, 500, "An unexpected error occurred");
};

export default handleError;
