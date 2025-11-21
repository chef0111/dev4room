import { UrlObject } from "url";

type RouteImpl<T> = T;

type StaticRoute = UrlObject;
type DynamicRoute = RouteImpl<(id: string | undefined) => UrlObject>;

type Routes = {
  home: StaticRoute;
  login: StaticRoute;
  register: StaticRoute;
  forgotPassword: StaticRoute;
  resetPassword: StaticRoute;
  verifyEmail: StaticRoute;
  collection: StaticRoute;
  community: StaticRoute;
  tags: StaticRoute;
  profiles: StaticRoute;
  profileEdit: StaticRoute;
  profile: DynamicRoute;
  question: DynamicRoute;
  questionEdit: DynamicRoute;
  tag: DynamicRoute;
  askQuestion: StaticRoute;
};

const routes: Routes = {
  home: { pathname: "/" },
  login: { pathname: "/login" },
  register: { pathname: "/register" },
  forgotPassword: { pathname: "/forgot-password" },
  resetPassword: { pathname: "/reset-password" },
  verifyEmail: { pathname: "/verify-email" },
  collection: { pathname: "/collection" },
  community: { pathname: "/community" },
  tags: { pathname: "/tags" },
  profiles: { pathname: "/profile" },
  profileEdit: { pathname: "/profile/edit" },
  profile: (id: string | undefined) => ({ pathname: `/profile/${id}` }),
  question: (id: string | undefined) => ({ pathname: `/questions/${id}` }),
  questionEdit: (id: string | undefined) => ({
    pathname: `/questions/${id}/edit`,
  }),
  tag: (id: string | undefined) => ({ pathname: `/tags/${id}` }),
  askQuestion: { pathname: "/ask-question" },
};

export default routes;
