"use client";

import z from "zod";
import { Suspense, useRef, useTransition, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { orpc } from "@/lib/orpc";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { AnswerSchema } from "@/lib/validations";
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import EditorFallback from "@/components/markdown/EditorFallback";
import { Field, FieldError, Button, Spinner } from "@/components/ui";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BsStars } from "react-icons/bs";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [editorKey, setEditorKey] = useState(0);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: answer?.content || "",
    },
  });

  const createAnswer = useMutation(
    orpc.answer.create.mutationOptions({
      onSuccess: () => {
        toast.success("Answer posted successfully!");
        form.reset();
        setEditorKey((prev) => prev + 1);
        router.refresh();
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to post answer");
      },
    }),
  );

  const editAnswer = useMutation(
    orpc.answer.update.mutationOptions({
      onSuccess: () => {
        toast.success("Answer updated successfully!");
        router.refresh();
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to update answer");
      },
    }),
  );

  const handleSubmit = (data: z.infer<typeof AnswerSchema>) => {
    startTransition(async () => {
      if (isEdit && answer?.id) {
        await editAnswer.mutateAsync({
          answerId: answer.id,
          content: data.content,
        });
      } else {
        await createAnswer.mutateAsync({
          questionId,
          content: data.content,
        });
      }
    });
  };

  const isSubmitting = isPending || form.formState.isSubmitting;
  const AISubmitting = false;

  return (
    <div>
      {!compact && (
        <div className="flex flex-col justify-between pt-4 gap-4 sm:flex-row sm:items-center sm:gap-2">
          <h4 className="pg-semibold text-dark400_light800">
            Write your answer here
          </h4>
          <Button
            className="btn hover:bg-light700_dark400! light-border-2 gap-1 rounded-md border px-4 py-2 text-link-100 shadow-none cursor-pointer"
            disabled={AISubmitting}
          >
            {AISubmitting ? (
              <>
                <Loader2 className="mr-1 size 4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BsStars className="text-orange-300 size-4" />
                Generate AI Answer
              </>
            )}
          </Button>
        </div>
      )}
      <form
        className={
          compact
            ? "flex w-full flex-col gap-4"
            : "space-y-4 mt-6 flex w-full flex-col gap-10"
        }
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Suspense fallback={<EditorFallback />}>
                <MarkdownEditor
                  key={editorKey}
                  id="answer-content"
                  editorRef={editorRef}
                  value={field.value}
                  onChange={field.onChange}
                  isInvalid={fieldState.invalid}
                />
              </Suspense>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex justify-end gap-2 z-10">
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
            disabled={isSubmitting}
            className="primary-gradient hover:primary-gradient-hover w-fit text-light-900 cursor-pointer"
          >
            {(() => {
              if (isSubmitting) {
                return (
                  <>
                    <Spinner className="border-primary-foreground/30 border-t-primary-foreground!" />
                    {isEdit ? "Updating..." : "Posting..."}
                  </>
                );
              }

              return isEdit ? "Update Answer" : "Post Answer";
            })()}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
