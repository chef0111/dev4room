import { listUsers } from "./user";
import { listQuestions, createQuestion, incrementViews } from "./question";
import { listTags, getTagQuestions, getPopular } from "./tag";

export const router = {
  user: {
    list: listUsers,
  },
  question: {
    list: listQuestions,
    create: createQuestion,
    view: incrementViews,
  },
  tag: {
    list: listTags,
    getQuestions: getTagQuestions,
    getPopular: getPopular,
  },
};
