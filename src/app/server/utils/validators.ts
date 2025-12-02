import "server-only";

import { z } from "zod";

export function validateArray<T>(
  items: unknown[],
  schema: z.ZodType<T>,
  entityName: string = "item",
): T[] {
  return items
    .map((item) => {
      const result = schema.safeParse(item);
      if (!result.success) {
        console.error(`${entityName} validation failed:`, result.error);
        return null;
      }
      return result.data;
    })
    .filter((item): item is T => item !== null);
}

export function validateOne<T>(
  item: unknown,
  schema: z.ZodType<T>,
  entityName: string = "item",
): T {
  const result = schema.safeParse(item);
  if (!result.success) {
    console.error(`${entityName} validation failed:`, result.error);
    throw new Error(`Failed to validate ${entityName} data`);
  }
  return result.data;
}
