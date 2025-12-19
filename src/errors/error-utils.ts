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

export function classifyError(
  error: Error | unknown,
  statusCode?: number
): ErrorType {
  if (statusCode === 404) return "not-found";
  if (statusCode === 401 || statusCode === 403) return "auth-error";
  if (statusCode && statusCode >= 500) return "server-error";

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes("not found") || message.includes("404")) {
      return "not-found";
    }
    if (message.includes("unauthorized") || message.includes("forbidden")) {
      return "auth-error";
    }
    if (message.includes("network") || message.includes("fetch")) {
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
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

export function isNetworkError(error: Error | unknown): boolean {
  if (error instanceof Error) {
    return (
      error.name === "NetworkError" ||
      error.message.includes("fetch") ||
      error.message.includes("network")
    );
  }
  return false;
}

export function isAuthError(error: Error | unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("unauthorized") ||
      error.message.includes("authentication") ||
      error.message.includes("sign in")
    );
  }
  return false;
}
