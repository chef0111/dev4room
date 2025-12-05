import { listUsers } from "./user";
import {
  listQuestions,
  getQuestion,
  createQuestion,
  editQuestion,
  getTopQuestions,
} from "./question";
import { listTags, getTagQuestions, getPopular } from "./tag";
import { createInteraction } from "./interaction";
import { createVote, hasVoted } from "./vote";

export const router = {
  user: {
    list: listUsers,
  },
  question: {
    list: listQuestions,
    get: getQuestion,
    create: createQuestion,
    edit: editQuestion,
    getTop: getTopQuestions,
  },
  tag: {
    list: listTags,
    getQuestions: getTagQuestions,
    getPopular: getPopular,
  },
  interaction: {
    create: createInteraction,
  },
  vote: {
    create: createVote,
    status: hasVoted,
  },
};
