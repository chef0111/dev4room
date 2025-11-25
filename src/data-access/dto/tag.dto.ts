import "server-only"
import { z } from "zod"; 

export const TagSchemaDTO = z.object({
    id: z.string(),
    name: z.string().min(1),
    questions: z.number().int().min(0),
    createdAt: z.date(),
}); 

export type TagDTO = z.infer<typeof TagSchemaDTO>;