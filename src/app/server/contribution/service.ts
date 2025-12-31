import "server-only";

import { contribution } from "@/database/schema";
import type { Transaction } from "../utils/types";

export type ContributionType = "question" | "answer" | "tag";

export class ContributionService {
  // Log a contribution
  static async log(
    tx: Transaction,
    userId: string,
    type: ContributionType,
    referenceId?: string
  ): Promise<void> {
    await tx.insert(contribution).values({
      userId,
      type,
      referenceId,
    });
  }
}
