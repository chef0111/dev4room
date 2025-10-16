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
import TextShimmer from "@/components/ui/text-shimmer";

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

  const isPending = false;

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
              <FieldLabel
                htmlFor="question-title"
                className="pg-semibold text-dark400_light800"
              >
                Question Title
                <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="question-title"
                aria-invalid={fieldState.invalid}
                className="pg-regular bg-light700_dark300 text-dark300_light700 min-h-12 border light-border-2 no-focus placeholder:text-dark300_light800"
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
              <FieldLabel
                htmlFor="question-content"
                className="pg-semibold text-dark400_light800"
              >
                Detailed explanation of your problem
                <span className="text-red-500">*</span>
              </FieldLabel>

              <Suspense
                fallback={
                  <TextShimmer duration={1}>Loading editor...</TextShimmer>
                }
              >
                <MarkdownEditor
                  editorRef={editorRef}
                  value={field.value}
                  onChange={field.onChange}
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
              className="flex flex-col w-full gap-3"
            >
              <FieldLabel
                htmlFor="question-tags"
                className="pg-semibold text-dark400_light800"
              >
                Tags
                <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="question-tags"
                aria-invalid={fieldState.invalid}
                className="pg-regular bg-light700_dark300 text-dark300_light700 min-h-14 border light-border-2 no-focus placeholder:text-dark300_light800"
                placeholder="Add tags..."
                autoComplete="off"
                value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean);
                  field.onChange(tags);
                }}
              />
              <FieldDescription className="body-regular text-light-500">
                Add up to 5 tags to describe what your question is about. Start
                typing to see suggestions.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="mt-12 flex justify-end">
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
