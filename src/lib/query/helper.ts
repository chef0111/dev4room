import { getErrorMessage } from "../handlers/error";

type Result<T> =
  | { data: T; error: undefined }
  | { data: undefined; error: { message: string } };

export async function safeFetch<T>(
  promise: Promise<T>,
  { error }: { error: string }
): Promise<Result<T>> {
  try {
    const data = await promise;
    return { data, error: undefined };
  } catch (e) {
    return {
      data: undefined,
      error: { message: getErrorMessage(e, error) },
    };
  }
}
