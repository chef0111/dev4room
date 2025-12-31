import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
  customType,
} from "drizzle-orm/pg-core";

const generateId = () => crypto.randomUUID();

// Custom vector type for pgvector
const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(2000)";
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string): number[] {
    return value
      .slice(1, -1)
      .split(",")
      .map((v) => parseFloat(v));
  },
});

// user table
export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    bio: text("bio"),
    location: text("location"),
    portfolio: text("portfolio"),
    reputation: integer("reputation").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    displayUsername: text("display_username"),
    role: text("role"),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
    embedding: vector("embedding"),
  },
  (table) => [index("user_embedding_idx").using("ivfflat", table.embedding)]
);

// session table
export const session = pgTable("session", {
  id: text("id").primaryKey().$defaultFn(generateId),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

// account table
export const account = pgTable("account", {
  id: text("id").primaryKey().$defaultFn(generateId),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// verification table
export const verification = pgTable("verification", {
  id: text("id").primaryKey().$defaultFn(generateId),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const tag = pgTable(
  "tag",
  {
    id: text("id").primaryKey().$defaultFn(generateId),
    name: text("name").notNull().unique(),
    status: text("status", { enum: ["pending", "approved"] })
      .default("pending")
      .notNull(),
    questions: integer("questions").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    embedding: vector("embedding"),
  },
  (table) => [index("tag_embedding_idx").using("ivfflat", table.embedding)]
);

export const question = pgTable(
  "question",
  {
    id: text("id").primaryKey().$defaultFn(generateId),
    title: text("title").notNull(),
    content: text("content").notNull(),
    status: text("status", { enum: ["pending", "approved", "rejected"] })
      .default("approved")
      .notNull(),
    rejectReason: text("reject_reason"),
    views: integer("views").default(0).notNull(),
    upvotes: integer("upvotes").default(0).notNull(),
    downvotes: integer("downvotes").default(0).notNull(),
    answers: integer("answers").default(0).notNull(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    embedding: vector("embedding"),
  },
  (table) => [index("question_embedding_idx").using("ivfflat", table.embedding)]
);

export const answer = pgTable(
  "answer",
  {
    id: text("id").primaryKey().$defaultFn(generateId),
    content: text("content").notNull(),
    upvotes: integer("upvotes").default(0).notNull(),
    downvotes: integer("downvotes").default(0).notNull(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    questionId: text("question_id")
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    embedding: vector("embedding"),
  },
  (table) => [index("answer_embedding_idx").using("ivfflat", table.embedding)]
);

export const tagQuestion = pgTable("tag_question", {
  id: text("id").primaryKey().$defaultFn(generateId),
  questionId: text("question_id")
    .notNull()
    .references(() => question.id, { onDelete: "cascade" }),
  tagId: text("tag_id")
    .notNull()
    .references(() => tag.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const collection = pgTable("collection", {
  id: text("id").primaryKey().$defaultFn(generateId),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => question.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const vote = pgTable("vote", {
  id: text("id").primaryKey().$defaultFn(generateId),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  actionId: text("action_id").notNull(), // ID of the question or answer
  actionType: text("action_type").notNull(), // 'question' or 'answer'
  voteType: text("vote_type").notNull(), // 'upvote' or 'downvote'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const interaction = pgTable("interaction", {
  id: text("id").primaryKey().$defaultFn(generateId),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // 'view', 'upvote', 'downvote', 'bookmark', 'post', 'edit', 'delete', 'search'
  actionId: text("action_id").notNull(), // ID of the related entity
  actionType: text("action_type").notNull(), // 'question' or 'answer'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const contribution = pgTable(
  "contribution",
  {
    id: text("id").primaryKey().$defaultFn(generateId),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["question", "answer", "tag"] }).notNull(),
    referenceId: text("reference_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("contribution_user_id_idx").on(table.userId),
    index("contribution_created_at_idx").on(table.createdAt),
  ]
);

export const schema = {
  user,
  session,
  account,
  verification,
  tag,
  question,
  answer,
  tagQuestion,
  collection,
  vote,
  interaction,
  contribution,
};
