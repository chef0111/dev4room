import { primaryKey } from "drizzle-orm/gel-core";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

// user table
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  bio: text("bio"),
  location: text("location"),
  reputation: integer("reputation").default(0).notNull(),
  portfolio: text("portfolio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

// session table
export const session = pgTable("session", {
  id: text("id").primaryKey(),
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
  id: text("id").primaryKey(),
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
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// interaction table
export const interaction = pgTable("interaction", {
  id: text("id").primaryKey(),
  actionId: text("action_id").notNull(), 
  user: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade"}),
  action: text("action"),
  actionType: text("action_type"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__*/ new Date())
    .notNull(), 
});

// vote table
export const vote = pgTable("vote", {
  id: text("id").primaryKey(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type"),
  voteType: text("vote_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(), 
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}); 

// question table
export const question = pgTable("question", {
  id: text("id").primaryKey(), 
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade"}),  
  views: integer("views")
    .default(0)
    .notNull(),
  answers: integer("answers")
    .default(0)
    .notNull(),
  upvotes: integer("upvotes")
    .default(0)
    .notNull(), 
  downvotes: integer("downvotes")
    .default(0)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(), 
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// tag table
export const tag = pgTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(), 
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(), 
});

// junction (many-to-many) table
export const questionTag = pgTable("question_tag", {
  questionId: text("question_id")
    .notNull()
    .references(() => question.id, { onDelete: "cascade" }),
  tagId: text("tag_id")
    .notNull()
    .references(() => tag.id, { onDelete: "cascade" }),
}
  // composite primaryKey to prevent duplicates
  // (table) => ({
  // pk: primaryKey({ columns: [table.questionId, table.tagId ]}), 
  // })
);

// answer table 
export const answer = pgTable("answer", {
  id: text("id").primaryKey(), 
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade"}),
  content: text("content").notNull(),
  upvotes: integer("upvotes")
    .default(0)
    .notNull(), 
  downvotes: integer("downvotes")
    .default(0)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(), 
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// collection table
export const collection = pgTable("collection", {
  id: text("id"),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => question.id, { onDelete: "cascade" }),
})

export const schema = { user, session, account, verification, interaction, vote, question, tag, questionTag, answer, collection };
