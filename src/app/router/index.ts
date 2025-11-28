import { listUsers } from "./user";
import {
  listQuestions,
  getQuestion,
  createQuestion,
  editQuestion,
  incrementViews,
} from "./question";
import { listTags, getTagQuestions, getPopular } from "./tag";

export const router = {
  user: {
    list: listUsers,
  },
  question: {
    list: listQuestions,
    get: getQuestion,
    create: createQuestion,
    edit: editQuestion,
    view: incrementViews,
  },
  tag: {
    list: listTags,
    getQuestions: getTagQuestions,
    getPopular: getPopular,
  },
};
