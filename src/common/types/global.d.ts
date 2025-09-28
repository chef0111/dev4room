type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { sucess: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type ApiErrorResponse = NextResponse<ErrorResponse>;
type ApiResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  image: string | null | undefined;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
