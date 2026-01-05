import {
  listUsers,
  getUser,
  getUserQuestions,
  getUserAnswers,
  getUserTags,
  getUserStats,
  updateUser,
  getUserContributions,
} from "./user";
import {
  listQuestions,
  getQuestion,
  createQuestion,
  editQuestion,
  getTopQuestions,
  deleteQuestion,
  getUserPendingQuestions,
  cancelPendingQuestion,
  checkDuplicateQuestion,
} from "./question";
import {
  listAnswers,
  getAnswer,
  createAnswer,
  editAnswer,
  deleteAnswer,
} from "./answer";
import { listTags, getTagQuestions, getPopular } from "./tag";
import { createVote, hasVoted } from "./vote";
import { listCollection, toggleSave, hasSaved } from "./collection";
import { search } from "./search";
import { generateAnswer } from "./ai";
import { getUploadUrl, confirmUpload, removeImage } from "./upload";
import {
  getStats as getAdminStats,
  listUsers as listAdminUsers,
  banUser,
  unbanUser,
  setUserRole,
  deleteUser,
  getGrowth,
  listPendingQuestions,
  approveQuestion,
  rejectQuestion,
} from "./admin";

export const router = {
  users: {
    list: listUsers,
    me: getUser,
    questions: getUserQuestions,
    answers: getUserAnswers,
    tags: getUserTags,
    stats: getUserStats,
    update: updateUser,
    contributions: getUserContributions,
  },
  questions: {
    list: listQuestions,
    get: getQuestion,
    create: createQuestion,
    edit: editQuestion,
    getTop: getTopQuestions,
    delete: deleteQuestion,
    pending: getUserPendingQuestions,
    cancelPending: cancelPendingQuestion,
    checkDuplicate: checkDuplicateQuestion,
  },
  answers: {
    list: listAnswers,
    get: getAnswer,
    create: createAnswer,
    update: editAnswer,
    delete: deleteAnswer,
  },
  tags: {
    list: listTags,
    getQuestions: getTagQuestions,
    getPopular: getPopular,
  },
  votes: {
    create: createVote,
    status: hasVoted,
  },
  collections: {
    list: listCollection,
    toggle: toggleSave,
    status: hasSaved,
  },
  search,
  ai: {
    generateAnswer,
  },
  upload: {
    getUrl: getUploadUrl,
    confirm: confirmUpload,
    remove: removeImage,
  },
  admin: {
    stats: getAdminStats,
    users: listAdminUsers,
    banUser,
    unbanUser,
    setRole: setUserRole,
    deleteUser,
    growth: getGrowth,
    pendingQuestions: listPendingQuestions,
    approveQuestion,
    rejectQuestion,
  },
};
