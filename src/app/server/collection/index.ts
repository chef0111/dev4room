import { authorized } from "@/app/middleware/auth";
import {
  toggleSave as toggleSaveDAL,
  hasSaved as hasSavedDAL,
} from "./collection.dal";
import {
  ToggleSaveSchema,
  HasSavedSchema,
  ToggleSaveOutputSchema,
  HasSavedOutputSchema,
} from "./collection.dto";

export const toggleSave = authorized
  .route({
    method: "POST",
    path: "/collection/toggle",
    summary: "Toggle Save Question",
    description: "Save or unsave a question to/from collection",
    tags: ["Collection"],
  })
  .input(ToggleSaveSchema)
  .output(ToggleSaveOutputSchema)
  .handler(async ({ input, context }) => {
    return toggleSaveDAL(input, context.user.id);
  });

export const hasSaved = authorized
  .route({
    method: "GET",
    path: "/collection/status",
    summary: "Check Save Status",
    description: "Check if the current user has saved a question",
    tags: ["Collection"],
  })
  .input(HasSavedSchema)
  .output(HasSavedOutputSchema)
  .handler(async ({ input, context }) => {
    return hasSavedDAL(input, context.user.id);
  });
