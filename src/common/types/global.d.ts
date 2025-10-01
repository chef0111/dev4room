type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string | undefined;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { sucess: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type ApiErrorResponse = NextResponse<ErrorResponse>;
type ApiResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

interface RemoveKeysParams {
  params: string;
  keysToRemove: string[];
}

interface CredentialsAuth {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe?: boolean;
}
