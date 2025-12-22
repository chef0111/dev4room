"use client";

import z from "zod";
import { useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";

import { AnswerSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import GenerateAIButton from "./generate-ai-button";
import AIValidationAlert from "./ai-validation-alert";
import { useCreateAnswer, useEditAnswer } from "@/queries/answer.queries";
import { FormMarkdown } from "@/components/form";

interface Answer {
  id: string;
  content: string;
}

interface AnswerFormProps {
  questionId: string;
  answer?: Answer;
  isEdit?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
  compact?: boolean;
}

const AnswerForm = ({
  questionId,
  answer,
  isEdit = false,
  onCancel,
  onSuccess,
  compact = false,
}: AnswerFormProps) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: answer?.content || "",
    },
  });

  const handleFormReset = useCallback(() => form.reset(), [form]);
  const handleEditorReset = useCallback(
    () => setEditorKey((prev) => prev + 1),
    []
  );

  const createAnswer = useCreateAnswer({
    onFormReset: handleFormReset,
    onEditorReset: handleEditorReset,
    onSuccess,
  });

  const editAnswer = useEditAnswer({
    onSuccess,
  });

  const handleAISuccess = (generatedAnswer: string) => {
    form.setValue("content", generatedAnswer, { shouldValidate: true });
    editorRef.current?.setMarkdown(generatedAnswer);
  };

  const handleSubmit = (data: z.infer<typeof AnswerSchema>) => {
    if (isEdit && answer?.id) {
      editAnswer.mutate({
        answerId: answer.id,
        content: data.content,
      });
    } else {
      createAnswer.mutate({
        questionId,
        content: data.content,
      });
    }
  };

  const isSubmitting = createAnswer.isPending || editAnswer.isPending;

  return (
    <div>
      {!compact && (
        <div className="flex flex-col justify-between gap-4 pt-4 sm:flex-row sm:items-center sm:gap-2">
          <h4 className="pg-semibold text-dark400_light800">
            Write your answer here
          </h4>
          <GenerateAIButton
            questionId={questionId}
            getUserAnswer={() => form.getValues("content") || ""}
            onSuccess={handleAISuccess}
            onValidationError={(msg) => {
              setAlertMessage(msg);
              setAlertOpen(true);
            }}
            disabled={isSubmitting || !form.formState.isDirty}
          />
        </div>
      )}

      <form
        className={
          compact
            ? "flex w-full flex-col gap-4"
            : "mt-2 flex w-full flex-col gap-10 space-y-4"
        }
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormMarkdown
          control={form.control}
          name="content"
          editorKey={editorKey}
          editorRef={editorRef}
        />

        <div className="z-10 flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-fit cursor-pointer"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isDirty}
            className="primary-gradient hover:primary-gradient-hover text-light-900 w-fit cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Spinner className="border-primary-foreground/30 border-t-primary-foreground!" />
                {isEdit ? "Updating..." : "Posting..."}
              </>
            ) : isEdit ? (
              "Update Answer"
            ) : (
              "Post Answer"
            )}
          </Button>
        </div>
      </form>

      <AIValidationAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        message={alertMessage}
      />
    </div>
  );
};

export default AnswerForm;
