import { authorized } from "@/app/middleware/auth";
import { standardSecurityMiddleware } from "@/app/middleware/arcjet/standard";
import { writeSecurityMiddleware } from "@/app/middleware/arcjet/write";
import {
  listCollection as listCollectionDAL,
  toggleSave as toggleSaveDAL,
  hasSaved as hasSavedDAL,
} from "./collection.dal";
import {
  ListCollectionSchema,
  ToggleSaveSchema,
  HasSavedSchema,
  ToggleSaveOutputSchema,
  HasSavedOutputSchema,
} from "./collection.dto";
import { QueryParamsSchema } from "@/lib/validations";

export const listCollection = authorized
  .route({
    method: "GET",
    path: "/collection",
    summary: "List Collection",
    tags: ["Collection"],
  })
  .input(QueryParamsSchema)
  .output(ListCollectionSchema)
  .handler(async ({ input, context }) => {
    return listCollectionDAL(input, context.user.id);
  });

export const toggleSave = authorized
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/collection/toggle",
    summary: "Toggle Save Question",
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
    tags: ["Collection"],
  })
  .input(HasSavedSchema)
  .output(HasSavedOutputSchema)
  .handler(async ({ input, context }) => {
    return hasSavedDAL(input, context.user.id);
  });
