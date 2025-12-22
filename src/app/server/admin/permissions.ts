import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * Custom permissions for the Dev4Room platform.
 *
 * This defines all available resources and their actions for role-based access control.
 * Use `as const` to ensure TypeScript infers the type correctly.
 */
export const statement = {
  ...defaultStatements,

  question: ["approve", "reject", "delete", "view-pending"],
  analytics: ["view-stats", "view-growth"],
  tag: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

// Default user role - no admin capabilities
export const user = ac.newRole({
  question: [],
  analytics: [],
  tag: [],
});

// Moderator role - can moderate content but not manage users
export const moderator = ac.newRole({
  question: ["approve", "reject", "view-pending"],
  analytics: ["view-stats"],
  tag: ["create", "update"],
});

// Admin role - full access to all resources
export const admin = ac.newRole({
  ...adminAc.statements,
  question: ["approve", "reject", "delete", "view-pending"],
  analytics: ["view-stats", "view-growth"],
  tag: ["create", "update", "delete"],
});

export type Role = "user" | "moderator" | "admin";
