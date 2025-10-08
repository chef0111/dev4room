export const sidebarTabs = [
  {
    imgUrl: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgUrl: "/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgUrl: "/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  {
    imgUrl: "/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgUrl: "/icons/question.svg",
    route: "/ask-question",
    label: "Ask a question",
  },
  {
    imgUrl: "/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
];

export const AUTH_FORM_TYPES = {
  LOGIN: {
    buttonLabel: "Log in",
    loadingLabel: "Logging in...",
    successMessage: "Logged in successfully!",
  },
  REGISTER: {
    buttonLabel: "Register",
    loadingLabel: "Registering...",
    successMessage: "Registered successfully!",
  },
  RESET_PASSWORD: {
    buttonLabel: "Reset Password",
    loadingLabel: "Resetting password...",
    successMessage: "Reset password successfully!",
  },
  FORGOT_PASSWORD: {
    buttonLabel: "Continue",
    loadingLabel: "Sending email...",
    successMessage: "Password reset request sent! Please check your email.",
  },
} as const;
