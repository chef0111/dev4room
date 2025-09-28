const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  collection: "/collection",
  community: "/community",
  tags: "/tags",
  profiles: "/profile",
  profile_edit: "/profile/edit",
  profile: (id: string | undefined) => `/profile/${id}`,
  question: (id: string) => `/questions/${id}`,
  question_edit: (id: string) => `/questions/${id}/edit`,
  tag: (id: string) => `/tags/${id}`,
  ask_question: "/ask-question",
  oauth_login: "login-oauth",
};

export default routes;
