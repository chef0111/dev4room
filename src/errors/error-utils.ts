export type ErrorType =
  | "not-found"
  | "server-error"
  | "auth-error"
  | "network-error"
  | "permission-error"
  | "unknown";

interface ErrorDetails {
  type: ErrorType;
  title: string;
  message: string;
  statusCode?: number;
}

function getStatusCode(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    const response = err.response as Record<string, unknown> | undefined;
    return (
      (err.status as number) ||
      (err.statusCode as number) ||
      (response?.status as number)
    );
  }
  return undefined;
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    return (err.code as string) || (err.errorCode as string);
  }
  return undefined;
}

export function classifyError(
  error: Error | unknown,
  statusCode?: number
): ErrorType {
  const status = statusCode || getStatusCode(error);

  if (status === 404) return "not-found";
  if (status === 401 || status === 403) return "auth-error";
  if (status && status >= 500) return "server-error";

  // Check oRPC error codes
  const errorCode = getErrorCode(error);
  if (errorCode === "UNAUTHORIZED") return "auth-error";
  if (errorCode === "FORBIDDEN") return "permission-error";
  if (errorCode === "NOT_FOUND") return "not-found";

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes("not found") || message.includes("404")) {
      return "not-found";
    }
    if (message.includes("unauthorized") || message.includes("forbidden")) {
      return "auth-error";
    }
    if (message.includes("network") || message.includes("fetch failed")) {
      return "network-error";
    }
    if (message.includes("permission") || message.includes("access denied")) {
      return "permission-error";
    }
  }

  return "unknown";
}

export function getErrorDetails(
  error: Error | unknown,
  type?: ErrorType
): ErrorDetails {
  const errorType = type || classifyError(error);

  const errorMap: Record<ErrorType, Omit<ErrorDetails, "type">> = {
    "not-found": {
      title: "Page Not Found",
      message: "The page you're looking for doesn't exist or has been moved.",
      statusCode: 404,
    },
    "server-error": {
      title: "Something Went Wrong",
      message:
        "We're experiencing technical difficulties. Please try again later.",
      statusCode: 500,
    },
    "auth-error": {
      title: "Authentication Required",
      message: "You need to be signed in to access this page.",
      statusCode: 401,
    },
    "network-error": {
      title: "Connection Failed",
      message:
        "Unable to connect to the server. Please check your internet connection.",
    },
    "permission-error": {
      title: "Access Denied",
      message: "You don't have permission to access this resource.",
      statusCode: 403,
    },
    unknown: {
      title: "Unexpected Error",
      message: "An unexpected error occurred. Please try again.",
      statusCode: 500,
    },
  };

  return {
    type: errorType,
    ...errorMap[errorType],
  };
}

export function formatErrorMessage(error: Error | unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}

export function logError(
  error: Error | unknown,
  context?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "development") {
    console.error("Error occurred:", {
      error,
      message: formatErrorMessage(error),
      status: getStatusCode(error),
      code: getErrorCode(error),
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

export function isNetworkError(error: Error | unknown): boolean {
  // Check for fetch/network errors
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (
      error.name === "NetworkError" ||
      (error.name === "TypeError" && message.includes("fetch")) ||
      message.includes("network") ||
      message.includes("fetch failed") ||
      message.includes("failed to fetch") ||
      message.includes("network request failed")
    ) {
      return true;
    }
  }

  // Check for network-related status codes (0 or offline)
  const status = getStatusCode(error);
  if (status === 0 || !status) {
    // No status usually means network error
    if (typeof error === "object" && error !== null) {
      const err = error as Record<string, unknown>;
      if (
        err.type === "network" ||
        (typeof err.message === "string" && err.message.includes("fetch"))
      ) {
        return true;
      }
    }
  }

  return false;
}

export function isAuthError(error: Error | unknown): boolean {
  // Check status codes
  const status = getStatusCode(error);
  if (status === 401 || status === 403) {
    return true;
  }

  // Check oRPC error codes
  const errorCode = getErrorCode(error);
  if (errorCode === "UNAUTHORIZED" || errorCode === "FORBIDDEN") {
    return true;
  }

  // Check error message
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("unauthorized") ||
      message.includes("authentication") ||
      message.includes("sign in") ||
      message.includes("you are unauthorized")
    );
  }

  return false;
}
