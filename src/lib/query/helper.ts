import { getErrorMessage } from "../handlers/error";

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export type FetchError = {
  message: string;
  cause?: unknown;
};

export async function safeFetch<T>(
  promise: Promise<T>,
  fallbackMessage: string
): Promise<Result<T, FetchError>> {
  try {
    const data = await promise;
    return { ok: true, value: data };
  } catch (e) {
    return {
      ok: false,
      error: {
        message: getErrorMessage(e, fallbackMessage),
        cause: e,
      },
    };
  }
}

export function resolveData<T, U, E>(
  result: Result<T, E>,
  select: (data: T) => U,
  empty: U
) {
  return result.ok
    ? {
        data: select(result.value),
        success: true,
        error: undefined,
      }
    : {
        data: empty,
        success: false,
        error: result.error,
      };
}
