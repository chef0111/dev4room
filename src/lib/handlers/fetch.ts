import handleError from "./error";
import logger from "./logger";
import { RequestError } from "@/errors/http-errors";

const defaultTimeout = 10000;

interface FetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ActionResponse<T>> {
  const { timeout, headers: customHeaders = {}, ...restOptions } = options;

  const controller = new AbortController();

  const id = setTimeout(() => controller.abort(), timeout ?? defaultTimeout);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = {
    ...defaultHeaders,
    ...customHeaders,
  };
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    const newError = isError(error)
      ? error
      : new Error("Unknown error occurred");

    if (newError.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
      throw new RequestError(408, "Request timed out");
    } else {
      logger.error(`Error fetching ${url}: ${newError.message}`);
    }

    return handleError(newError) as ActionResponse<T>;
  } finally {
    clearTimeout(id);
  }
}
