"use client";

import z from "zod";
import { Suspense, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { AnswerSchema } from "@/lib/validations";
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import { Button } from "@/components/ui/button";
import EditorFallback from "@/components/markdown/EditorFallback";
import { Field, FieldError } from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { BsStars } from "react-icons/bs";

interface AnswerFormProps {
  question: string;
  questionTitle: string;
  questionContent: string;
}

const AnswerForm = ({
  question,
  questionTitle,
  questionContent,
}: AnswerFormProps) => {
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const editorRef = useRef<MDXEditorMethods>(null);

  const handleSubmit = async () => {
    // TODO: Implement submit answer logic
  };

  const answering = form.formState.isSubmitting;
  const AISubmitting = false;

  return (
    <div>
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
      <form
        className="space-y-4 mt-6 flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Suspense fallback={<EditorFallback />}>
                <MarkdownEditor
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

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={answering}
            className="primary-gradient hover:primary-gradient-hover w-fit text-light-900 cursor-pointer"
          >
            {answering ? (
              <>
                <Loader2 className="mr-1 size-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Answer"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
