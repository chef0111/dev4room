export const DEFAULT_EMPTY = {
  title: "No Data Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    label: "Add Data",
    href: "/",
  },
};

export const DEFAULT_ERROR = {
  title: "Oops! Something Went Wrong",
  message: "Even our code can have a bad day. Give it another shot.",
  button: {
    label: "Retry Request",
    href: "/",
  },
};

export const EMPTY_QUESTION = {
  title: "Ahh, No Questions Yet!",
  message:
    "The question board is empty. Maybe it's waiting for your brilliant question to get things rolling 🚀",
  button: {
    label: "Ask Question",
    href: "/ask-question",
  },
};

export const EMPTY_TAGS = {
  title: "No Tags Found",
  message: "The tag cloud is empty. Add some keywords to make it rain 🏷️",
  button: {
    label: "Create Tag",
    href: "/tags",
  },
};

export const EMPTY_ANSWERS = {
  title: "No Answers Found",
  message:
    "The answer board is empty. Make it filled with your brilliant answer.",
};

export const EMPTY_COLLECTIONS = {
  title: "Collections Are Empty",
  message:
    "Looks like you haven’t created any collections yet. Start curating something extraordinary today",
  button: {
    label: "Save to Collection",
    href: "/collection",
  },
};

export const EMPTY_USERS = {
  title: "No Users Found",
  message: "You're ALONE. The only one here. More users are coming soon!",
};

export const ERROR_IMAGE = {
  light: "/images/error-light.png",
  dark: "/images/error-dark.png",
  alt: "Error state illustration",
} as const;

export const EMPTY_IMAGE = {
  light: "/images/empty-light.png",
  dark: "/images/empty-dark.png",
  alt: "Empty state illustration",
} as const;
