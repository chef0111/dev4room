"use client";

import { useMutation } from "@tanstack/react-query";
import { orpc, client } from "@/lib/orpc";
import { Button, Spinner } from "@/components/ui";
import { BsStars } from "react-icons/bs";
import { TextShimmer } from "@/components/ui/dev";
import { toast } from "sonner";

interface GenerateAIButtonProps {
  questionId: string;
  getUserAnswer: () => string;
  onSuccess: (answer: string) => void;
  onValidationError: (message: string) => void;
  disabled?: boolean;
}

const MIN_ANSWER_LENGTH = 20;

const GenerateAIButton = ({
  questionId,
  getUserAnswer,
  onSuccess,
  onValidationError,
  disabled = false,
}: GenerateAIButtonProps) => {
  const generateAI = useMutation(orpc.ai.generateAnswer.mutationOptions());

  const handleClick = async () => {
    const userAnswer = getUserAnswer().trim();

    if (userAnswer.length < MIN_ANSWER_LENGTH) {
      onValidationError(
        `Please write your answer first (at least ${MIN_ANSWER_LENGTH} characters). The AI will then help enhance and improve your response.`
      );
      return;
    }

    try {
      const question = await client.question.get({ questionId });

      if (!question) {
        toast.error("Question not found");
        return;
      }

      const result = await generateAI.mutateAsync({
        question: question.title,
        content: question.content,
        userAnswer,
      });

      if (!result.isValid) {
        onValidationError(
          result.reason ||
            "Your answer doesn't appear to be related to the question. Please provide a relevant response and try again."
        );
        return;
      }

      if (result.answer) {
        onSuccess(result.answer);
        toast.success("AI answer generated!");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate AI answer";
      toast.error(message);
    }
  };

  const isGenerating = generateAI.isPending;

  return (
    <Button
      type="button"
      className="btn hover:bg-light700_dark400! light-border-2 text-link-100 cursor-pointer gap-1 rounded-md border px-4 py-2 shadow-none"
      disabled={isGenerating || disabled}
      onClick={handleClick}
    >
      {isGenerating ? (
        <>
          <Spinner className="border-primary-foreground/30 border-t-primary-foreground! mr-1" />
          <TextShimmer duration={1}>Generating...</TextShimmer>
        </>
      ) : (
        <>
          <BsStars className="size-4 text-orange-300" />
          Generate AI Answer
        </>
      )}
    </Button>
  );
};

export default GenerateAIButton;
