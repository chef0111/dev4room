import {
  listUsers,
  getUser,
  getUserQuestions,
  getUserAnswers,
  getUserTags,
  getUserStatsRoute,
  updateUser,
} from "./user";
import {
  listQuestions,
  getQuestion,
  createQuestion,
  editQuestion,
  getTopQuestions,
} from "./question";
import { listTags, getTagQuestions, getPopular } from "./tag";
import { createVote, hasVoted } from "./vote";
import { listCollection, toggleSave, hasSaved } from "./collection";

export const router = {
  user: {
    list: listUsers,
    get: getUser,
    questions: getUserQuestions,
    answers: getUserAnswers,
    tags: getUserTags,
    stats: getUserStatsRoute,
    update: updateUser,
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
  vote: {
    create: createVote,
    status: hasVoted,
  },
  collection: {
    list: listCollection,
    toggle: toggleSave,
    status: hasSaved,
  },
};
