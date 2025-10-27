"use client";

import { Suspense, useRef } from "react";
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import { MDXEditorMethods } from "@mdxeditor/editor";
import TagCard from "../tags/TagCard";
import { getTechDisplayName } from "@/lib/utils";
import EditorFallback from "@/components/editor/EditorFallback";

interface QuestionFormProps {
  question?: Question;
  isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit }: QuestionFormProps) => {
  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });

  const handleCreateQuestion = (data: z.infer<typeof QuestionSchema>) => {
    console.log(data);
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

  const isPending = form.formState.isSubmitting;

  return (
    <form
      className="flex flex-col w-full gap-10"
      onSubmit={form.handleSubmit(handleCreateQuestion)}
    >
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col w-full"
            >
              <FieldLabel htmlFor="question-title" className="pg-semibold">
                Question Title
                <span className="text-red-500">*</span>
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
              className="flex flex-col w-full"
            >
              <FieldLabel htmlFor="question-content" className="pg-semibold">
                Detailed explanation of your problem
                <span className="text-red-500">*</span>
              </FieldLabel>

              <Suspense fallback={<EditorFallback />}>
                <MarkdownEditor
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
              className="flex flex-col w-full"
            >
              <FieldLabel htmlFor="question-tags" className="pg-semibold">
                Tags
                <span className="text-red-500">*</span>
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
                <div className="flex-start flex-wrap mt-2 gap-2">
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
            className="primary-gradient hover:primary-gradient-hover text-light-900! cursor-pointer"
            onClick={() => handleCreateQuestion}
          >
            {isPending ? (
              <>
                <Loader2Icon className="animate-spin size-4" />
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
