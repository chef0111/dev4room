"use client";

import { Suspense, useRef, useState, useCallback } from "react";
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
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import { MDXEditorMethods } from "@mdxeditor/editor";
import TagCard from "../tags/TagCard";
import { getTechDisplayName } from "@/lib/utils";
import EditorFallback from "@/components/markdown/EditorFallback";
import { useCreateQuestion, useEditQuestion } from "@/queries/question.queries";

interface QuestionFormProps {
  question?: Question;
  isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit }: QuestionFormProps) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [editorKey, setEditorKey] = useState(0);

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
    <form
      className="flex w-full flex-col gap-10"
      onSubmit={form.handleSubmit(handleSubmitQuestion)}
    >
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex w-full flex-col"
            >
              <FieldLabel htmlFor="question-title" className="pg-semibold">
                Question Title
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="question-title"
                aria-invalid={fieldState.invalid}
                className="base-input placeholder:text-dark300_light800"
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                autoComplete="off"
              />
              <FieldDescription className="body-regular text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex w-full flex-col"
            >
              <FieldLabel htmlFor="question-content" className="pg-semibold">
                Detailed explanation of your problem
                <span className="text-destructive">*</span>
              </FieldLabel>

              <Suspense fallback={<EditorFallback />}>
                <MarkdownEditor
                  key={editorKey}
                  id="question-content"
                  editorRef={editorRef}
                  value={field.value}
                  onChange={field.onChange}
                  isInvalid={fieldState.invalid}
                />
              </Suspense>

              <FieldDescription className="body-regular text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
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
              <Input
                id="question-tags"
                name={field.name}
                aria-invalid={fieldState.invalid}
                className="base-input placeholder:text-dark300_light800"
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

              <FieldDescription className="body-regular text-light-500">
                Add up to 5 tags to describe what your question is about.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
  );
};

export default QuestionForm;
