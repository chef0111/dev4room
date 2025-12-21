"use client";

import { useRef, useState, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { QuestionSchema } from "@/lib/validations";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Button,
  Spinner,
} from "@/components/ui";
import PendingDialog from "./pending-dialog";
import { MDXEditorMethods } from "@mdxeditor/editor";
import TagCard from "../tags/tag-card";
import { getTechDisplayName } from "@/lib/utils";
import { useCreateQuestion, useEditQuestion } from "@/queries/question.queries";
import { FormInput, FormMarkdown } from "@/components/form";

interface QuestionFormProps {
  question?: Question;
  isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit }: QuestionFormProps) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [showPendingDialog, setShowPendingDialog] = useState(false);

  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });

  const handleFormReset = useCallback(() => form.reset(), [form]);
  const handleEditorReset = useCallback(
    () => setEditorKey((prev) => prev + 1),
    []
  );

  const createQuestion = useCreateQuestion({
    onFormReset: handleFormReset,
    onEditorReset: handleEditorReset,
    onPending: () => setShowPendingDialog(true),
  });

  const editQuestion = useEditQuestion({
    onFormReset: handleFormReset,
    onEditorReset: handleEditorReset,
  });

  const isPending = createQuestion.isPending || editQuestion.isPending;

  const handleSubmitQuestion = (data: z.infer<typeof QuestionSchema>) => {
    if (isEdit && question?.id) {
      editQuestion.mutate({
        questionId: question.id,
        ...data,
      });
    } else {
      createQuestion.mutate(data);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    const tagInput = e.currentTarget.value.trim();

    if (
      tagInput === "" &&
      field.value.length > 0 &&
      form.formState.errors.tags
    ) {
      e.currentTarget.value = "";
      form.clearErrors("tags");
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const normalizedTag = getTechDisplayName(tagInput);
      const existingTags = field.value.map((tag) => getTechDisplayName(tag));
      const existedTag = existingTags.includes(normalizedTag);

      if (tagInput.length > 20) {
        form.setError("tags", {
          type: "manual",
          message: "Tag must be less than 20 characters.",
        });
      } else if (existedTag) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists.",
        });
      } else if (field.value.length >= 5) {
        form.setError("tags", {
          type: "manual",
          message: "You can only add up to 5 tags.",
        });
      } else if (!/^[a-z]+([-.][a-z]+)*$/.test(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message:
            "Tags must be in lowercase letters, using only hyphens or dots as separators (e.g., node.js, react-native).",
        });
      } else if (tagInput && tagInput.length <= 20 && !existedTag) {
        form.setValue("tags", [...field.value, normalizedTag]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      }
    }
  };

  const handleRemoveTag = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required.",
      });
    }
  };

  return (
    <>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleSubmitQuestion)}
      >
        <FieldGroup>
          <FormInput
            control={form.control}
            name="title"
            label={
              <>
                Question Title <span className="text-destructive">*</span>
              </>
            }
            className="base-input! no-focus! placeholder:text-dark300_light800"
            placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
            description="Be specific and imagine you're asking a question to another person."
          />

          <FormMarkdown
            control={form.control}
            editorKey={editorKey}
            editorRef={editorRef}
            name="content"
            label={
              <>
                Detailed explanation of your problem
                <span className="text-destructive">*</span>
              </>
            }
            description="Introduce the problem and expand on what you put in the title. Minimum 20 characters."
          />

          <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex w-full flex-col"
              >
                <FieldLabel htmlFor="question-tags" className="pg-semibold">
                  Tags
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldDescription className="body-regular text-light-500">
                  Add up to 5 tags to describe what your question is about.
                </FieldDescription>

                <Input
                  id="question-tags"
                  name={field.name}
                  aria-invalid={fieldState.invalid}
                  className="base-input! no-focus! placeholder:text-dark300_light800"
                  placeholder="Add tags..."
                  onKeyDown={(e) => handleKeyDown(e, field)}
                />

                {field.value.length > 0 && (
                  <div className="flex-start mt-2 flex-wrap gap-2">
                    {field?.value?.map((tag, index) => (
                      <TagCard
                        key={index}
                        id={index.toString()}
                        name={tag}
                        compact
                        isButton
                        remove
                        handleRemove={() => handleRemoveTag(tag, field)}
                      />
                    ))}
                  </div>
                )}

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="my-6 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="primary-gradient hover:primary-gradient-hover text-light-900! cursor-pointer transition-colors"
            >
              {isPending ? (
                <>
                  <Spinner className="border-primary-foreground/30 border-t-primary-foreground!" />
                  <span>Submitting</span>
                </>
              ) : (
                <span>{isEdit ? "Edit Question" : "Ask Question"}</span>
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>

      <PendingDialog
        open={showPendingDialog}
        onOpenChange={setShowPendingDialog}
      />
    </>
  );
};

export default QuestionForm;
