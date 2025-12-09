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
    successMessage: "An OTP has been sent! Please check your email.",
  },
  RESET_PASSWORD: {
    buttonLabel: "Reset Password",
    loadingLabel: "Resetting password...",
    successMessage: "Reset password successfully!",
  },
  FORGOT_PASSWORD: {
    buttonLabel: "Continue",
    loadingLabel: "Sending email...",
    successMessage: "An OTP has been sent! Please check your email.",
  },
} as const;

export const programmingLanguages = {
  javascript: "JavaScript",
  jsx: "JavaScript (React)",
  typescript: "TypeScript",
  tsx: "TypeScript (React)",
  python: "Python",
  java: "Java",
  csharp: "C#",
  sql: "SQL",
  go: "Go",
  php: "PHP",
  ruby: "Ruby",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  sass: "Sass",
  json: "JSON",
  bash: "Bash",
  txt: "Plain Text",
  "": "Unspecified",
};

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};

export const profileTabs = [
  { value: "questions", label: "Questions" },
  { value: "answers", label: "Answers" },
];

export const profileFields = [
  {
    name: "name" as const,
    label: "Name",
    placeholder: "Your Name",
    required: true,
    autoComplete: "name",
  },
  {
    name: "username" as const,
    label: "Username",
    placeholder: "Your username",
    required: true,
    autoComplete: "username",
  },
  {
    name: "portfolio" as const,
    label: "Portfolio Link",
    placeholder: "https://your-portfolio.com",
    type: "url" as const,
    autoComplete: "url",
  },
  {
    name: "location" as const,
    label: "Location",
    placeholder: "Where do you live?",
    required: true,
    autoComplete: "address-level1",
  },
];
