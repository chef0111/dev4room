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

interface Tag {
  id: string;
  name: string;
  questions?: number;
}

interface Author {
  id: string;
  name: string;
  image: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
}

interface Answer {
  id: string;
  author: Author;
  content: string;
  createdAte: Date;
  upvotes: number;
  downvotes: number;
  questionId: string;
}

interface Collection {
  id: string;
  author: string | Author;
  question: Question;
}
