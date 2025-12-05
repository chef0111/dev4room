import { authorized } from "@/app/middleware/auth";
import { createInteraction as createInteractionDAL } from "./interaction.dal";
import {
  CreateInteractionSchema,
  InteractionOutputSchema,
} from "./interaction.dto";

export const createInteraction = authorized
  .route({
    method: "POST",
    path: "/interaction",
    summary: "Create Interaction",
    description: "Create a new interaction and update user reputation",
    tags: ["Interactions"],
  })
  .input(CreateInteractionSchema)
  .output(InteractionOutputSchema)
  .handler(async ({ input, context }) => {
    const interaction = await createInteractionDAL(input, context.user.id);
    return { interaction };
  });
