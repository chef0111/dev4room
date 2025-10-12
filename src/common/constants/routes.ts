const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  collection: "/collection",
  community: "/community",
  tags: "/tags",
  profiles: "/profile",
  profileEdit: "/profile/edit",
  profile: (id: string | undefined) => `/profile/${id}`,
  question: (id: string) => `/questions/${id}`,
  questionEdit: (id: string) => `/questions/${id}/edit`,
  tag: (id: string) => `/tags/${id}`,
  askQuestion: "/ask-question",
};

export default routes;
